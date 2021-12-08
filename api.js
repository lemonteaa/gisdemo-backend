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

module.exports = router
