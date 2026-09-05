import { postgresAdapter } from '@payloadcms/db-postgres'
import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { requestDrizzleMap } from './lib/db-lifecycle'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Poles } from './collections/Poles'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Posts } from './collections/Posts'
import { Leads } from './collections/Leads'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { r2Storage } from '@payloadcms/storage-r2'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: (() => {
    const baseAdapter = postgresAdapter({
      pool: {
        get connectionString() {
          try {
            const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')];
            const env = cf?.env || (globalThis as any).env || (globalThis as any);
            const hyperdrive = env?.HYPERDRIVE || (process.env as any)?.HYPERDRIVE;
            if (hyperdrive?.connectionString) {
              return hyperdrive.connectionString;
            }
          } catch {}
          return process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
        },
      },
      transactionOptions: false,
      prodMigrations: migrations as any,
    });

    const origInit = baseAdapter.init;
    baseAdapter.init = function (args: any) {
      const adapter = origInit.call(this, args);

      let fallbackDrizzle: any = undefined;
      let fallbackPool: any = undefined;

      const getOrCreateScope = (cfContext: any, connectionString: string) => {
        const key = cfContext.ctx || cfContext;
        let scope = requestDrizzleMap.get(key);
        if (!scope) {
          const PoolClass = (adapter as any).pg?.Pool;
          const requestPool = new PoolClass({
            connectionString,
            max: 10,
            maxUses: 1,
          });
          const requestDrizzle = drizzle({
            client: requestPool,
            logger: (adapter as any).logger || false,
            schema: (adapter as any).schema,
          } as any);
          scope = {
            pool: requestPool,
            drizzle: requestDrizzle,
            ended: false,
          };
          requestDrizzleMap.set(key, scope);
          if (cfContext !== key) {
            requestDrizzleMap.set(cfContext, scope);
          }
        }
        return scope;
      };

      Object.defineProperty(adapter, 'drizzle', {
        get() {
          const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
          const connectionString = cfContext?.env?.HYPERDRIVE?.connectionString;

          if (connectionString) {
            return getOrCreateScope(cfContext, connectionString).drizzle;
          }

          // Fallback Node.js (CLI, Migrations, Seed, Tests, Bootstrap)
          return fallbackDrizzle;
        },
        set(val) {
          const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
          const connectionString = cfContext?.env?.HYPERDRIVE?.connectionString;
          if (connectionString) {
            const scope = getOrCreateScope(cfContext, connectionString);
            scope.drizzle = val;
            return;
          }
          fallbackDrizzle = val;
        },
        configurable: true,
        enumerable: true,
      });

      Object.defineProperty(adapter, 'pool', {
        get() {
          const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
          const connectionString = cfContext?.env?.HYPERDRIVE?.connectionString;

          if (connectionString) {
            return getOrCreateScope(cfContext, connectionString).pool;
          }

          return fallbackPool;
        },
        set(val) {
          const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
          const connectionString = cfContext?.env?.HYPERDRIVE?.connectionString;
          if (connectionString) {
            const scope = getOrCreateScope(cfContext, connectionString);
            scope.pool = val;
            return;
          }
          fallbackPool = val;
        },
        configurable: true,
        enumerable: true,
      });

      return adapter;
    };

    return baseAdapter;
  })(),
  collections: [
    Poles,
    Services,
    CaseStudies,
    Posts,
    Pages,
    Leads,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    r2Storage({
      collections: {
        media: true,
      },
      bucket: new Proxy({} as any, {
        get(_target, prop) {
          const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')];
          const env = cf?.env || (globalThis as any).env || (globalThis as any);
          const bucket = env?.MEDIA_BUCKET || (process.env as any)?.MEDIA_BUCKET;
          if (bucket && typeof bucket[prop] === 'function') {
            return bucket[prop].bind(bucket);
          }
          return bucket?.[prop];
        },
      }),
      enabled: Boolean(
        typeof process.env.CLOUDFLARE_WORKERS !== 'undefined' ||
        process.env.CF_PAGES ||
        process.env.NODE_ENV === 'production' ||
        (process.env.MEDIA_BUCKET as any) ||
        (globalThis as any).MEDIA_BUCKET
      ),
    }),
  ],
  globals: [
    SiteSettings,
    Header,
    Footer,
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp: typeof process.env.CLOUDFLARE_WORKERS !== 'undefined' ? undefined : sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
