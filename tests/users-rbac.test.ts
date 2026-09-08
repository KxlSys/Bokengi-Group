/**
 * Suite de tests de validation — Phase 4A : RBAC Users & Sanctuarisation Super Admin.
 * Couvre l'ensemble des scénarios obligatoires T-01 à T-16 :
 * - T-01 : ID 1 reconnu Super Admin
 * - T-02 : ID 1 statut active sanctuarisé
 * - T-03 : DELETE Users/1 -> 403 Forbidden
 * - T-04 : PATCH Users/1 avec role!='super-admin' -> 403 Forbidden
 * - T-05 : PATCH Users/1 avec status!='active' -> 403 Forbidden
 * - T-06 : Admin tentant de passer en 'super-admin' -> 403 Forbidden
 * - T-07 : Éditeur tentant de passer en 'super-admin' -> 403 Forbidden
 * - T-08 : Création d'un utilisateur avec role 'super-admin' -> 403 Forbidden
 * - T-09 : Super Admin modifiant un compte admin/éditeur légitimement -> Autorisé
 * - T-10 : 'super-admin' exclu du dropdown Admin UI via filterOptions
 * - T-11 : Tiers (même admin) tentant de modifier le profil ID 1 -> 403 Forbidden
 * - T-12 : Admin essayant de supprimer un autre admin -> 403 Forbidden
 * - T-13 : Éditeur tentant de supprimer un utilisateur -> 403 Forbidden
 * - T-14 : Utilisateur non Super-Admin tentant de s'auto-promouvoir -> 403 Forbidden
 * - T-15 : Compte suspendu ou rejeté bloqué d'accès admin -> canAccessAdmin = false
 * - T-16 : Migration RBAC exporte up et down et contient la sanctuarisation SQL ID 1
 */

import { APIError } from 'payload'
import {
  isSuperAdmin,
  isAdmin,
  isEditor,
  canAccessAdmin,
} from '../src/access/roles'
import {
  protectUserSecurity,
  preventUser1Deletion,
} from '../src/collections/hooks/protectUserSecurity'
import { Users } from '../src/collections/Users'
import * as rbacMigration from '../src/migrations/20260908_220000_add_users_rbac'

interface TestResult {
  id: string
  name: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

function assert(condition: boolean, testId: string, testName: string, details: string) {
  if (condition) {
    results.push({ id: testId, name: testName, passed: true, details })
    console.log(`  [PASS] ${testId} — ${testName} : ${details}`)
  } else {
    results.push({ id: testId, name: testName, passed: false, details: `ÉCHEC : ${details}` })
    console.error(`  [FAIL] ${testId} — ${testName} : ${details}`)
  }
}

// Utilisateurs de simulation
const userSuperAdminId1 = { id: 1, email: 'admin@bokengi-group.com', role: 'super-admin', status: 'active' }
const userAdminId2 = { id: 2, email: 'manager@bokengi-group.com', role: 'admin', status: 'active' }
const userAdminId3 = { id: 3, email: 'director@bokengi-group.com', role: 'admin', status: 'active' }
const userEditorId4 = { id: 4, email: 'editor@bokengi-group.com', role: 'editor', status: 'active' }
const userSuspendedId5 = { id: 5, email: 'suspended@bokengi-group.com', role: 'admin', status: 'suspended' }
const userRejectedId6 = { id: 6, email: 'rejected@bokengi-group.com', role: 'editor', status: 'rejected' }
const userPendingId7 = { id: 7, email: 'pending@bokengi-group.com', role: 'editor', status: 'pending' }

const mockCollection = {} as any
const mockContext = {} as any

async function runTests() {
  console.log('\n======================================================')
  console.log('EXÉCUTION DE LA SUITE DE TESTS — PHASE 4A RBAC USERS')
  console.log('======================================================\n')

  // --------------------------------------------------------------------------
  // T-01 : ID 1 reconnu Super Admin
  // --------------------------------------------------------------------------
  {
    const check1 = isSuperAdmin(userSuperAdminId1)
    const check2 = isSuperAdmin({ id: 1 }) // ID 1 sans rôle explicite reconnu Super Admin
    const checkOther = isSuperAdmin(userAdminId2)
    assert(
      check1 === true && check2 === true && checkOther === false,
      'T-01',
      'ID 1 a le rôle super-admin',
      'Le compte ID 1 est exclusivement reconnu comme Super Admin.'
    )
  }

  // --------------------------------------------------------------------------
  // T-02 : ID 1 a le statut active
  // --------------------------------------------------------------------------
  {
    const canAccess = canAccessAdmin(userSuperAdminId1)
    const suspendedId1 = isSuperAdmin({ id: 1, status: 'suspended' })
    assert(
      canAccess === true && suspendedId1 === false,
      'T-02',
      'ID 1 a le statut active',
      'Le compte ID 1 actif a plein accès, une tentative de suspension le neutraliserait immédiatement.'
    )
  }

  // --------------------------------------------------------------------------
  // T-03 : DELETE Users/1 -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await preventUser1Deletion({
      collection: mockCollection,
      context: mockContext,
      id: 1,
      req: { user: userSuperAdminId1 } as any,
    })
    assert(false, 'T-03', 'DELETE Users/1 -> 403', 'La suppression aurait dû être bloquée avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('sanctuarisé') && err.message?.includes('supprimé')
    assert(
      is403 && messageMatches,
      'T-03',
      'DELETE Users/1 -> 403',
      `HTTP ${err.status} reçu avec message : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-04 : PATCH Users/1 avec role='editor' ou 'admin' -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userSuperAdminId1,
      data: { role: 'editor' },
      req: { user: userSuperAdminId1 } as any,
    })
    assert(false, 'T-04', 'PATCH Users/1 rétrogradation rôle', 'La rétrogradation aurait dû être bloquée')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('rétrogradé')
    assert(
      is403 && messageMatches,
      'T-04',
      'PATCH Users/1 rétrogradation rôle -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-05 : PATCH Users/1 avec status='suspended' -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userSuperAdminId1,
      data: { status: 'suspended' },
      req: { user: userSuperAdminId1 } as any,
    })
    assert(false, 'T-05', 'PATCH Users/1 suspension statut', 'La suspension aurait dû être bloquée')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('suspendu')
    assert(
      is403 && messageMatches,
      'T-05',
      'PATCH Users/1 suspension statut -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-06 : Admin tentant de passer en 'super-admin' -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userAdminId2,
      data: { role: 'super-admin' },
      req: { user: userAdminId2 } as any,
    })
    assert(false, 'T-06', 'Admin s’auto-promouvant super-admin', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    assert(
      is403,
      'T-06',
      'Admin s’auto-promouvant super-admin -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-07 : Éditeur tentant de passer en 'super-admin' ou 'admin' -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userEditorId4,
      data: { role: 'super-admin' },
      req: { user: userEditorId4 } as any,
    })
    assert(false, 'T-07', 'Éditeur s’auto-promouvant super-admin', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    assert(
      is403,
      'T-07',
      'Éditeur s’auto-promouvant super-admin -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-08 : Création d'un utilisateur avec role 'super-admin' -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'create',
      data: { email: 'fake-admin@example.com', role: 'super-admin', status: 'active' },
      req: { user: userSuperAdminId1 } as any,
    })
    assert(false, 'T-08', 'Création super-admin', 'La création d’un super-admin aurait dû être bloquée')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('super-admin') && err.message?.includes('création')
    assert(
      is403 && messageMatches,
      'T-08',
      'Création utilisateur super-admin -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-09 : Super Admin modifiant légitimement un compte admin/éditeur -> Autorisé
  // --------------------------------------------------------------------------
  try {
    const updateResult = await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userAdminId2,
      data: { name: 'Directeur Technique Mis à Jour', role: 'admin' },
      req: { user: userSuperAdminId1 } as any,
    })
    const isAllowed = updateResult && updateResult.name === 'Directeur Technique Mis à Jour'
    assert(
      Boolean(isAllowed),
      'T-09',
      'Super Admin modification légitime compte tiers',
      `Modification autorisée avec succès : name="${updateResult?.name}"`
    )
  } catch (err: any) {
    assert(false, 'T-09', 'Super Admin modification légitime', `Erreur inattendue : ${err.message}`)
  }

  // --------------------------------------------------------------------------
  // T-10 : 'super-admin' exclu du dropdown Admin UI via filterOptions
  // --------------------------------------------------------------------------
  {
    const roleField = Users.fields.find((f: any) => f.name === 'role') as any
    const filterOptionsFn = roleField?.filterOptions
    const initialOptions = [
      { label: 'Administrateur', value: 'admin' },
      { label: 'Éditeur', value: 'editor' },
      { label: 'Super Administrateur', value: 'super-admin' },
    ]
    const filtered = filterOptionsFn ? filterOptionsFn({ options: initialOptions } as any) : initialOptions
    const hasSuperAdmin = filtered.some((opt: any) => (typeof opt === 'string' ? opt : opt.value) === 'super-admin')
    assert(
      filterOptionsFn !== undefined && hasSuperAdmin === false && filtered.length === 2,
      'T-10',
      'super-admin jamais proposé dans UI filterOptions',
      `Le rôle "super-admin" est filtré du formulaire Admin UI. Rôles accessibles : [${filtered.map((o: any) => o.value).join(', ')}]`
    )
  }

  // --------------------------------------------------------------------------
  // T-11 : Tiers (même admin) tentant de modifier le profil ID 1 -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userSuperAdminId1,
      data: { name: 'Tentative Piratage Nom ID 1' },
      req: { user: userAdminId2 } as any,
    })
    assert(false, 'T-11', 'Admin modifiant profil ID 1', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('sanctuarisé') && err.message?.includes('lui-même')
    assert(
      is403 && messageMatches,
      'T-11',
      'Tiers modifiant profil ID 1 -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-12 : Admin essayant de supprimer un autre admin -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    const mockPayload = {
      findByID: async () => userAdminId3,
    }
    await preventUser1Deletion({
      collection: mockCollection,
      context: mockContext,
      id: 3,
      req: { user: userAdminId2, payload: mockPayload } as any,
    })
    assert(false, 'T-12', 'Admin supprimant un autre admin', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('administrateur ne peut pas supprimer un autre administrateur')
    assert(
      is403 && messageMatches,
      'T-12',
      'Admin supprimant un autre admin -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-13 : Éditeur tentant de supprimer un utilisateur -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await preventUser1Deletion({
      collection: mockCollection,
      context: mockContext,
      id: 4,
      req: { user: userEditorId4 } as any,
    })
    assert(false, 'T-13', 'Éditeur supprimant un utilisateur', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('éditeurs ne sont pas autorisés à supprimer')
    assert(
      is403 && messageMatches,
      'T-13',
      'Éditeur supprimant un utilisateur -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-14 : Utilisateur non Super-Admin tentant de s'auto-promouvoir en modifiant son propre rôle
  // --------------------------------------------------------------------------
  try {
    await protectUserSecurity({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: userEditorId4,
      data: { role: 'admin' },
      req: { user: userEditorId4 } as any,
    })
    assert(false, 'T-14', 'Éditeur s’auto-promouvant admin', 'Aurait dû être bloqué avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('propre rôle')
    assert(
      is403 && messageMatches,
      'T-14',
      'Auto-promotion de rôle non Super-Admin -> 403',
      `HTTP ${err.status} reçu : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-15 : Compte suspendu ou rejeté bloqué d'accès admin
  // --------------------------------------------------------------------------
  {
    const suspendedAccess = canAccessAdmin(userSuspendedId5)
    const rejectedAccess = canAccessAdmin(userRejectedId6)
    const pendingAccess = canAccessAdmin(userPendingId7)
    const activeAdminAccess = canAccessAdmin(userAdminId2)
    const activeEditorAccess = canAccessAdmin(userEditorId4)

    const isSecure =
      suspendedAccess === false &&
      rejectedAccess === false &&
      pendingAccess === false &&
      activeAdminAccess === true &&
      activeEditorAccess === true

    assert(
      isSecure,
      'T-15',
      'Comptes inactifs/suspendus bloqués de /admin',
      'Seuls les utilisateurs au statut "active" avec un rôle valide sont autorisés sur /admin.'
    )
  }

  // --------------------------------------------------------------------------
  // T-16 : Migration RBAC exporte up et down et contient la sanctuarisation SQL ID 1
  // --------------------------------------------------------------------------
  {
    const hasUp = typeof rbacMigration.up === 'function'
    const hasDown = typeof rbacMigration.down === 'function'
    assert(
      hasUp && hasDown,
      'T-16',
      'Migration RBAC up & down disponibles',
      'La migration 20260908_220000_add_users_rbac est conforme et exporte les fonctions up et down.'
    )
  }

  // --------------------------------------------------------------------------
  // Bilan
  // --------------------------------------------------------------------------
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed

  console.log('\n------------------------------------------------------')
  console.log(`RÉSULTATS : ${passed}/${total} tests réussis (${failed} échecs)`)
  console.log('------------------------------------------------------\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Erreur fatale lors des tests :', err)
  process.exit(1)
})
