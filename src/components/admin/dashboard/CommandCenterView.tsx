import React from 'react'
import type { AdminViewServerProps, Payload } from 'payload'
import { WelcomeBanner } from './WelcomeBanner'
import { KpiGrid } from './KpiGrid'
import { ActionRequiredTable } from './ActionRequiredTable'
import { RecentActivityFeed } from './RecentActivityFeed'
import { ContentOverview } from './ContentOverview'
import { QuickActionBar } from './QuickActionBar'
import { getLeadKpis } from '@/lib/admin/getLeadKpis'
import { getActionRequiredLeads } from '@/lib/admin/getActionRequiredLeads'
import { getRecentActivity } from '@/lib/admin/getRecentActivity'
import { getContentOverview } from '@/lib/admin/getContentOverview'

export const CommandCenterView = async (
  props: Partial<AdminViewServerProps>
): Promise<React.JSX.Element> => {
  try {
    let payload: Payload | undefined =
      props.payload || props.initPageResult?.req?.payload

    if (!payload) {
      try {
        const { getPayload } = await import('payload')
        const configPromise = (await import('@payload-config')).default
        payload = await getPayload({ config: configPromise })
      } catch (err) {
        console.error('Could not initialize Payload in CommandCenterView:', err)
      }
    }

    const user = props.user || props.initPageResult?.req?.user
    const userName = typeof (user as any)?.name === 'string' ? (user as any).name : null
    const userEmail = typeof (user as any)?.email === 'string' ? (user as any).email : null

    const [kpis, actionLeads, recentActivity, contentOverview] = await Promise.all([
      getLeadKpis(payload),
      getActionRequiredLeads(payload, { limit: 6 }),
      getRecentActivity(payload, { limit: 6 }),
      getContentOverview(payload),
    ])

    return (
      <div className="bokengi-command-center-wrap">
        <main className="bokengi-command-center" aria-label="Bokengi Command Center">
          {/* 1. Header: WelcomeBanner + LiveClock */}
          <WelcomeBanner userName={userName} userEmail={userEmail} showClock={true} />

          {/* 2. KPI Grid (Total, Nouveau, Contacté, Qualifié, Converti, Archivé) */}
          <KpiGrid data={kpis.data} error={kpis.error} />

          {/* 3. À Traiter: ActionRequiredTable (Priorité absolue) */}
          <ActionRequiredTable
            leads={actionLeads.data}
            totalCount={actionLeads.totalCount}
            error={actionLeads.error}
          />

          {/* 4. Deux colonnes: Activité récente (CRM) | État des contenus (CMS) */}
          <div className="bokengi-dashboard-split">
            <RecentActivityFeed
              activities={recentActivity.data}
              error={recentActivity.error}
            />
            <ContentOverview
              data={contentOverview.data}
              error={contentOverview.error}
            />
          </div>

          {/* 5. Actions rapides: Raccourcis vers les sections clés */}
          <QuickActionBar />
        </main>
      </div>
    )
  } catch (error) {
    console.error('CommandCenterView render error:', error)
    return (
      <div className="bokengi-command-center-wrap">
        <main className="bokengi-command-center" aria-label="Bokengi Command Center">
          <header className="bokengi-welcome-banner" style={{ padding: '2rem' }}>
            <h1 className="bokengi-welcome-banner__title">Espace d&apos;administration</h1>
            <p className="bokengi-welcome-banner__subtitle">
              Bienvenue dans votre espace de pilotage Bokengi Group.
            </p>
          </header>
          <QuickActionBar />
        </main>
      </div>
    )
  }
}

export default CommandCenterView
