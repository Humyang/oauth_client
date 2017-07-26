var uid = require('uid')
var mongo = require('koa-mongo')
const http = require('http');
var CONFIG = require('./config.js')

var querystring = require('querystring').encode


let _OAUTH_SERVER = {
	url:'localhost',
	port:3000,
	path:'/token_verify'
}
let _dbname_login_status = 'OAUTH_CLIENT_LOGINED_STATUS'

async function fetchToeknStatus(token){
	return new Promise(function(reslove,reject){
		const body = JSON.stringify({
		  'token': token
		});
		const options = {
		  hostname: _OAUTH_SERVER.url,
		  port: _OAUTH_SERVER.port,
		  path: _OAUTH_SERVER.path,
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		    "Content-Length": Buffer.byteLength(body)
		  }
		};
		const req = http.request(options, (res) => {
		  let data = ''
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
		  	data = chunk
		  });
		  res.on('end', () => {
		  	reslove(JSON.parse(data))
		  });
		});

		req.on('error', (e) => {
			reject(e.message)
		});
		// let b = new formData()
		// req.write(postData);
		// debugger
		req.end(body);
	})
}

async function oauth_client(ctx,next){
	// debugger
	//来自oauth_server的tokenA
	let tokenA = ctx.request.fields.token

	// 调用 oauth_server 的接口验证 tokenA 状态
	let tokenA_verify = await fetchToeknStatus(tokenA)
	console.log(tokenA_verify)
	// console.log(tokenA_verify)

	let tokenB = uid(40)

	let obj = {
		tokenB,
		tokenA,
		username:tokenA_verify.username,
		uid:tokenA_verify.uid
	}
	// 写入登录状态
	let _insert_res = await ctx.mongo
                    .db(CONFIG.dbname)
                    .collection(_dbname_login_status)
                    .insert(obj)

	
                    debugger
	// 返回tokenB给前端
	ctx.body={
		status:true,
		token:tokenB,
		username:tokenA_verify.username,
		uid:tokenA_verify.uid
	}
}

function oauth_login_check(){
	return async function(ctx,next){

		let token = ctx.request.fields.token
        let _login_check_res = await ctx.mongo
                    .db(CONFIG.dbname)
                    .collection(_dbname_login_status)
                    .findOne({token:token})

        if(_login_check_res === null){
            // throw new Error('未登陆')
            throwError(CODE.LOGIN_NO_LOGIN)
        }
        if(_login_check_res.status === false){
            throwError(CODE.LOGIN_TOKEN_INVALID)
        }

       // 将登录信息传递给上下文
		ctx.LOGIN_STATUS = {
			uid:_login_check_res.uid,
			username:_login_check_res.username
		}

		await next()
	}
}
module.exports = {
	oauth_client,
	oauth_login_check
}