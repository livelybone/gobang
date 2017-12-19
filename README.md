#GoBang
目前支持人机对弈（不过AI有点蠢...），后期可以加入node，实现双人对弈。未使用框架（项目小），使用requireJS实现模块化编码，未使用其他插件，没有使用r.js合并代码。

#双人对弈
Node ./server/server.js 启动服务器
目前支持在同一个网关内对弈，比如wifi

#实现方式
1、Ajax 长轮询
2、WebSocket