var koa = require('koa')
var koaRouter = require('koa-router')
var body = require('koa-better-body')
const app = new koa();
const router = new koaRouter();
const PORT = 3000;


function middleware(){
	return async function(ctx,next){

		console.log(5)
		await next()
		console.log(6)
	}

	// next().then(()=>{
		// console.log(5)
	// })
}

router.get('/',middleware(),async function(ctx,next){
	console.log(1)
	await next()
	console.log(2)
},async function(ctx,next){
	console.log(3)
	await next()
	console.log(4)
});




app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);