import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
import Vue from 'vue'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import Vant from 'vant';
import { Toast } from 'vant';
import 'vant/lib/index.css';
import moment from 'moment'
import echarts from 'echarts'
import '../static/icon/iconfont.css'
import Create from '@/common/js/create.js';
import Alert from '@/components/LightHint.vue';
import _ from 'lodash';
Vue.use(Toast);
Vue.config.productionTip = false;
Vue.prototype.$Alert= ((obj) => {//挂载在原型上
    return Create(Alert,obj).show() //返回组件实例
});
Vue.prototype._ = _;
import {  IsPC } from '@/common/js/utils.js'
import preventReClick from '@/directives/preventReClick.js'
Vue.use(preventReClick);
if (process.env.NODE_ENV == 'development') {
    Vue.config.devtools = true;
} else {
    Vue.config.devtools = false;
};

import VueLazyLoad from 'vue-lazyload';

Vue.prototype.Base64 = require('js-base64').Base64;
// 全局挂载时间格式化方法
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).format(pattern)
});

//处理移动端click事件300ms延迟
import FastClick from 'fastclick'
FastClick.attach(document.body);
FastClick.prototype.focus = function(targetElement) {
    targetElement.focus();
};
Vue.prototype.$moment = moment;

// 全局挂载监听设备物理返回按键的方法
function gotoURL(callback) {
    window.onpopstate = null;
    window.onpopstate = function() {
        callback()
    }
}
Vue.prototype.gotoURL = gotoURL;

//初始化样式
import './common/stylus/index.less'

//移动端适配
import 'lib-flexible/flexible'
import App from './App'

// vue剪切板功能
Vue.use(VueClipboard);

Vue.use(Vant);

// 图片懒加载
Vue.use(VueLazyLoad, {
    preLoad: 1.3,
    loading: './static/img/img-loading.gif',
    error: './static/img/img-error.jpeg',
    attempt: 2
});

Vue.config.productionTip = false;

if (IsPC()) {
    // Vue.use(new VueSocketIO({
    //    debug: true,
    //    connection: 'http://localhost:10001'
    // }))
};
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    created() {},
    template: '<App/>'
});
(function fixHashParams() {
    const hash = window.location.hash;
    
    // 检查 hash 是否包含 ? (例如: "#/?proId=7&depId=1658")
    if (hash.includes('?')) {
      // 1. 提取 ? 后面的参数部分
      const paramsPart = hash.split('?')[1]; // 得到 "proId=7&depId=1658"
      
      if (paramsPart) {
        // 2. 构造新的 URL：当前路径 + 标准查询参数 + 剩余的 hash 路径
        // 假设 hash 格式为 "#/?params.../actualPath"，我们需要保留 /actualPath
        const actualHashPath = hash.includes('/?') ? hash.split('/?')[1].replace(paramsPart, '') : '/';
        
        // 3. 拼接新 URL
        // 注意：这里需要确保不要产生死循环，可以加一个标记
        const newUrl = window.location.origin + 
                       window.location.pathname + 
                       '?' + paramsPart + 
                       '#/' + actualHashPath;
        
        // 4. 替换当前 URL，不产生历史记录
        window.location.replace(newUrl);
      }
    }
  })();