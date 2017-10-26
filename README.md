# 构建项目步骤

1. 创建新项目
2. 创建新项目服务端
3. 安装oauth_client
4. 项目服务端接入oauth_client，router.post('/xxx',oauth_client)

```
var OAUTCH_CLIENT = require('../oauth_client/lib/index.js')
router.post('/oauth_login',OAUTCH_CLIENT.oauth_client())
```

5. 服务端为需要判断登陆状态的接口添加中间件：oauth_client.oauth_login_check
```
router.post('/note',async function(ctx,next){
    await next()
},OAUTCH_CLIENT.oauth_login_check(),async function(ctx,next){
	
})
```

6.项目客户端调用接口：

