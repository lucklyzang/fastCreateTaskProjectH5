import Vue from 'vue';
import Vuex from 'vuex';
import common from './common.js';
// 运送
import  transTask from './trans/transTask.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
	  common,
    transTask
  }
});