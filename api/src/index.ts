import Koa from 'koa'
import { createReadStream } from 'fs'
import { setupMiddlewares } from './middlewares'
import { smolRouter } from './routes'
import setupRouter from './helpers/setupRouter'
import { initDatabase } from './db'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const app = new Koa()

initDatabase()
setupMiddlewares(app)

setupRouter(app, smolRouter)

app.use((ctx) => {
  ctx.type = 'text/html'
  ctx.status = 404
  return (ctx.body = createReadStream('public/404.html'))
})

const PORT = Number(process.env.PORT) || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'
const ADDRESS = NODE_ENV !== 'production' ? '0.0.0.0' : undefined

app.listen(PORT, ADDRESS, () => {
  console.log(`Successfully started server at http://localhost:${PORT}`)
})
