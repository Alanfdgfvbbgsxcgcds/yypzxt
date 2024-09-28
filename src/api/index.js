import request from '../utils/request.js'

// 登录接口
export const login = (data) => {
  return request.post('/login', data)
}
// 获取首页
export const layoutIndex = () => {
  return request.get('/Index/index')
}

// 获取订单详情
export const h5Companion = () => {
  return request.get('/h5/companion')
}

// 创建订单
export const createOrder = (data) => {
  return request.post('/createOrder', data)
}

// 订单列表
export const orderList = (params) => {
  return request.get('/order/list', { params })
}

// 订单详情
export const orderDetail = (params) => {
  return request.get('/order/detail', { params })
}