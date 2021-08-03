import Router from '@koa/router'
import { createReadStream } from 'fs'
import { nanoid } from 'nanoid'
import { smols } from '../db'
import { Smol, smolSchema } from '../models/smol.model'

const router = new Router()

router.get('/smols', async (ctx) => {
  ctx.body = {
    smols: await smols.find()
  }
})

router.get('/:id', async (ctx) => {
  const { id } = ctx.params

  const smol = await smols.findOne({ slug: id })

  if (!smol) {
    ctx.type = 'text/html'
    ctx.status = 404
    return (ctx.body = createReadStream('public/404.html'))
  }

  ctx.redirect(smol.url)
})

router.post('/new', async (ctx) => {
  const { url }: any = ctx.request.body

  try {
    await smolSchema.validate({ url })
  } catch (error) {
    ctx.status = 400
    return (ctx.body = {
      error: 'Validation Error',
      message: error.errors
    })
  }

  const existingSmol = await smols.findOne<Smol>(
    { url },
    { projection: { slug: 1 } }
  )

  if (existingSmol) return (ctx.body = existingSmol)

  const smol = new Smol({ url, slug: nanoid(5) })

  await smols.insertOne(smol)

  ctx.body = {
    message: 'Smol created successfully!',
    slug: smol.slug
  }
})

export { router as smolRouter }
