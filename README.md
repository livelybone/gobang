#GoBang
目前支持人机对弈，双人对弈。前端未使用框架，使用requireJS实现模块化编码，未使用其他插件，发布可以使用r.js合并代码。

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
WebSocket (socket.io), 未完成
思路：全事件驱动
    
```bash
const io = require('socket.io')(port);
io.on('connection',(socket)=>{});    
```
全局消息，io.emit()

私有消息，socket.emit()

#使用node net 模块简单实现 socket 通信
./server/websocket.js

./server/server-mysocket.js