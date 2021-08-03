import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import helmet from 'koa-helmet'
import ratelimit from 'koa-ratelimit'
import cors from '@koa/cors'

const memoryDb = new Map()

export function setupMiddlewares (app: Koa) {
  app.use(cors())
  app.use(logger())
  app.use(bodyParser())
  app.use(koaStatic('public'))
  app.use(helmet())
  app.use(
    ratelimit({
      driver: 'memory',
      db: memoryDb,
      duration: 60 * 1000,
      errorMessage: JSON.stringify({
        error: 'Rate Limit',
        message: 'Slow down boi'
      }),
      id: (ctx) => ctx.ip,
      headers: {
        remaining: 'X-Rate-Limit-Remaining',
        reset: 'X-Rate-Limit-Reset',
        total: 'X-Rate-Limit-Total'
      },
      max: 10,
      disableHeader: false
    })
  )
}
