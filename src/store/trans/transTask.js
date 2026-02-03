import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransTaskSchedulingState } from '@/common/js/resetStore.js'
export default {
  state: getDefaultTransTaskSchedulingState(),

  getters:{
    transParentMessage: (state) => {
      state.transParentMessage = JSON.parse(getStore('transParentMessage')) ? JSON.parse(getStore('transParentMessage')) : {};
			return state.transParentMessage
    }
  },

  mutations:{

    // 保存运送任务类型
    changeTransParentMessage (state, payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('transParentMessage', payLoad);
				state.transParentMessage = payLoad
			}
    },

    //重置TaskScheduling信息的状态
		resetTransTaskSchedulingState(state) {
      Object.assign(state, getDefaultTransTaskSchedulingState())
    }
  },
  
  actions:{
    resetTransTaskSchedulingStateEvent({ commit }) {
			commit('resetTransTaskSchedulingState')
		}
  }
}
