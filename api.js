const koaBody = require('koa-body')
const Router = require('koa-router')
const database = require('./database')
//const joi = require('joi')
//const validate = require('koa-joi-validate')

const router = new Router()

// Hello World Test Endpoint
router.get('/hello', async ctx => {
    ctx.body = 'Hello World'
})

// Get time from DB
router.get('/time', async ctx => {
    const result = await database.queryTime()
    ctx.body = result
})

router.put('/shop', koaBody(), async ctx => {
    console.log(ctx.request.body.foo);
    const result = await database.addShop({
        feat: {
            cc_acc: true,
            access: false,
            cs: false,
            allhr: true,
            takeout: true
        },
        name: "Hello window",
        addr: "Middle of nowhere",
        reg: 1,
        price: [50, 100],
        loc: [-71.104, 42.315]
    })
    ctx.body = result;
})

module.exports = router
