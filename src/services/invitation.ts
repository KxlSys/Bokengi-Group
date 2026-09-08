import crypto from 'crypto'

export interface PreparedInvitation {
  token: string
  expiresAt: string
  activationUrl: string
  email: string
}

/**
 * Génère un jeton cryptographiquement aléatoire (256 bits / 64 caractères hexadécimaux).
 */
export function generateActivationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Calcule la date d'expiration du jeton (par défaut 48 heures).
 */
export function calculateActivationExpiration(hours = 48): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

/**
 * Prépare une invitation d'activation de compte sans envoyer d'email réel.
 * Conforme au système d'authentification et de reset_password natif Payload.
 */
export function prepareUserInvitation(
  user: { email: string; name?: string | null },
  serverUrl = ''
): PreparedInvitation {
  const token = generateActivationToken()
  const expiresAt = calculateActivationExpiration(48)
  const baseUrl =
    serverUrl ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'https://bokengi-group.com'
  const activationUrl = `${baseUrl}/admin/reset-password?token=${token}`

  // Audit de sécurité : le jeton n'est jamais consigné en clair dans les logs
  return {
    token,
    expiresAt,
    activationUrl,
    email: user.email,
  }
}
