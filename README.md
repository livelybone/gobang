#GoBang
目前支持人机对弈，双人对弈。未使用框架，使用requireJS实现模块化编码，未使用其他插件，发布可以使用r.js合并代码。

```bash
# 配置文件设置
cp js/config/config.js.sample js/config/config.js

# 启动所有服务
npm start

# 启动客户端
npm run client 

# 启动服务器
npm run server
```

#实现方式
Ajax 长轮询
