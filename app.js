const express = require('express')
const httpProxy = require('express-http-proxy')
const logger = require('morgan');
const config = require('./config/index')
const cors = require('cors')
const app = express()

const userServiceProxy = httpProxy(config.proxy_host, {
  //过滤器，指定类型的转发（可选）
  // filter: function (req, res) {
  //   return req.method == 'GET';
  // },
  //请求路径解析，转换一下路径（可选）
  proxyReqPathResolver: function (req) {
    var parts = req.url.split('?');
    var queryString = parts[1];
    var updatedPath = parts[0].replace(`${config.proxy_prefix}/`, `${config.convert_prefix}/`);
    console.log(config.proxy_host + updatedPath + (queryString ? '?' + queryString : ''));
    return updatedPath + (queryString ? '?' + queryString : '');
  },
  //处理响应（可选）
  // userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
  //   console.log(proxyResData);
  //   return JSON.stringify(proxyResData);
  // },
  //处理请求（可选）
  // proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
  //   // you can update headers
  //   // proxyReqOpts.headers['Content-Type'] = 'text/html';
  //   // you can change the method
  //   // proxyReqOpts.method = 'GET';
  //   return proxyReqOpts;
  // },
  //处理请求body（可选）
  // proxyReqBodyDecorator: function (bodyContent, srcReq) {
  //   console.log(bodyContent);
  //   return bodyContent;
  // },
  //处理请求头（可选）
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // recieves an Object of headers, returns an Object of headers.
    return headers;
  },
  //自定义错误（可选）
  proxyErrorHandler: function (err, res, next) {
    next(err);
  }
})

logger.format('proxy', '[proxy param] :method :url :status')
app.use(logger('proxy'))
app.use(cors())

// 认证、限速等一系列中间件
app.use((req, res, next) => {
  next()
})

// 代理请求
app.get(`${config.proxy_prefix}/*`, async (req, res, next) => {
  console.log('get: 代理');
  await userServiceProxy(req, res, next)
})

app.post(`${config.proxy_prefix}/*`, async (req, res, next) => {
  console.log('post：代理');
  await userServiceProxy(req, res, next)
})

module.exports = app