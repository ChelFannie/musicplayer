import Vue from 'vue'
import Vuex from 'vuex'
// 注意引入的方式不一样
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
// 在控制台实时打印修改的state中的值
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// 在线下调试，debug为true
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  // 线下模式，使用严格模式,生产环境不使用
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
