const app = require('../app')
const debug = require('debug')('http')
const http = require('http')
// 导入nodejs-websocket模块
//const io = require('nodejs-websocket')
const config = require('../config/index')

function createHttpServer() {
  /**
  * 从环境中获取端口并存储在Express中。
  */
  const port = normalizePort(process.env.PORT || config.port)
  app.set('port', port)

  /**
   * 创建http服务
   */
  const server = http.createServer(app)
  console.log('服务启动中.....');
  server.listen(port, () => {
    console.log(`代理服务启动成功，端口：${port}`)
  })
  /** 注册错误处理事件 */
  server.on('error', onError)
  /** 注册Http服务监听处理事件 */
  server.on('listening', onListening)

  // 执行websocket处理连接方法
  // io.createServer(connection=>{
  //   console.log('new connection...')
  //   //处理客户端发送过来的消息	
  //   connection.on("text",function(data){
  //     console.log("接收到的客户端消息:"+data);
  //     connection.sendText("服务器端返回数据:"+data)
      
  //   //监听关闭
  //     connection.on("close", function (code, reason) {
  //         console.log("Connection closed")
  //     })
  //     //监听异常
  //   connection.on("error",() => {
  //     console.log('服务异常关闭...')
  //   })	
  //   })
  // }).listen(3000)

  /**
   * 将端口规范化为数字、字符串或false。
   */
  function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }

  /**
   * HTTP服务器“错误”事件的事件监听器  
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // 处理特定的监听错误  
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' 权限不足');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' 端口被占用');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   *  HTTP服务器“监听”事件的事件监听器  
   */
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
}

createHttpServer()