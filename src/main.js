// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 对es6API的转义  必须放在最前面
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// router的实例
import router from './router'
import 'common/stylus/index.styl'
// 解决移动端点击的300ms的延迟
import fastclick from 'fastclick'

Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
