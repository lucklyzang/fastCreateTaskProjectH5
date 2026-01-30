import Vue from 'vue';
import Vuex from 'vuex';
import common from './common.js';
// 运送
import transTaskScheduling from './trans/taskScheduling.js'
// 工程
import projectTaskScheduling from './project/taskScheduling.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
	  common,
    transTaskScheduling,
    projectTaskScheduling
  }
});