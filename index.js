var uid = require('uid')
var mongo = require('koa-mongo')
const http = require('http');

let _OAUTH_SERVER = {
	url:'118.89.19.201'
	port:8100,
	path:'/token_verify'
}
let _dbname_login_status = 'OAUTH_CLIENT_LOGINED_STATUS'

async function fetchToeknStatus(token){
	return new Promise(function(reject,reslove){
		const postData = JSON.stringify({
		  'token': token
		});
		const options = {
		  hostname: _OAUTH_SERVER.url,
		  port: _OAUTH_SERVER.port,
		  path: _OAUTH_SERVER.path,
		  method: 'GET',
		  headers: {
		    'Content-Type': 'application/json'
		  }
		};
		const req = http.request(options, (res) => {
		  let data = ''
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
		  	data = chunk
		  });
		  res.on('end', () => {
		  	reslove(data)
		  });
		});

		req.on('error', (e) => {
			reject(e.message)
		});

		req.write(postData);
		req.end();
	})
}

async function oauth_client(ctx,next){

	//来自oauth_server的tokenA
	let tokenA = ctx.request.fields.tokenA

	// 调用 oauth_server 的接口验证 tokenA 状态
	let tokenA_verify = await fetchToeknStatus(tokenA)

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
                    .insert(_token_stauts)

	

	// 返回tokenB给前端
	ctx.bdoy={
		status:true,
		token:tokenB
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