const Koa = require('koa');
const Router = require('@koa/router');
const ratelimit = require('koa-ratelimit');
const { createReadStream } = require('fs')
const { nanoid } = require('nanoid')
const yup = require('yup');

if (process.env.NODE_ENV !== "production")
    require('dotenv').config();

const db = require('monk')(process.env.MONGO_URI || 'localhost/smol')

const smols = db.get('smols')
smols.createIndex('slug', { unique: true })
smols.createIndex('url', { unique: true })

const app = new Koa();
const router = new Router();
const memoryDb = new Map();

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

app.use(require('koa-logger')())
app.use(require('koa-bodyparser')());
app.use(require('koa-static')("public"));
app.use(require('koa-helmet')())
app.use(ratelimit({
    driver: 'memory',
    db: memoryDb,
    duration: 60 * 1000,
    errorMessage: { error: "Rate Limit", message: 'Slow down boi' },
    id: (ctx) => ctx.ip,
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 10,
    disableHeader: false
}));

router.get('/smols', async ctx => {
    ctx.body = {
        smols: await smols.find()
    }
});

router.get("/:id", async ctx => {
    const { id } = ctx.params

    const smol = await smols.findOne({ slug: id })

    if (!smol) {
        ctx.type = "text/html"
        ctx.status = 404
        return ctx.body = createReadStream("public/404.html")
    }

    ctx.redirect(smol.url)
})

router.post("/new", async ctx => {
    const { url } = ctx.request.body

    try {
        await schema.validate({ url })
    } catch (error) {
        ctx.status = 400
        return ctx.body = {
            error: "Validation Error",
            message: error.errors
        }
    }

    const existingSmol = await smols.findOne({ url }, { projection: { slug: 1 } })

    if (existingSmol)
        return ctx.body = existingSmol

    const smol = await smols.insert({ url, slug: nanoid(5) })

    ctx.body = {
        message: "Smol created successfully!",
        slug: smol.slug
    }
})

app.use(router.routes())
    .use(router.allowedMethods());

app.use(ctx => {
    ctx.type = "text/html"
    ctx.status = 404
    return ctx.body = createReadStream("public/404.html")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Successfully started serversssssssssssssssssss at http://localhost:${PORT}`)
});