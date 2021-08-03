import Koa from 'koa'
import Router from '@koa/router'

export default function (app: Koa, router: Router) {
  app.use(router.routes()).use(router.allowedMethods())
}
