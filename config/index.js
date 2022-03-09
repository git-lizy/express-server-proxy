module.exports = {
  /** 启动的端口 */
  port: '4000',
  /** 代理的接口地址 */
  proxy_host: 'http://localhost:7001',
  /** 代理接口的前缀 */
  proxy_prefix: '/api',
  /** 转换后的接口前缀 */
  convert_prefix: '/api'
}