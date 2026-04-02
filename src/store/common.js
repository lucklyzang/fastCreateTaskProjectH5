import { setStore, getStore } from '@/common/js/utils'
import { getDefaultCommonState } from '@/common/js/resetStore.js'
export default {	
	state: getDefaultCommonState(),
	getters: {
		statusBarHeight:(state) => {
			state.statusBarHeight = getStore('statusBarHeight') ? getStore('statusBarHeight') : 47;
			return state.statusBarHeight
		},
		templateType: (state) => {
			return state.templateType
		},
		depId:(state) => {
			state.depId = getStore('depId') ? getStore('depId') : '';
			return state.depId
		},
		proId:(state) => {
			state.proId = getStore('proId') ? getStore('proId') : '';
			return state.proId
		},
		navigationBarHeight:(state) => {
			state.navigationBarHeight = getStore('navigationBarHeight') ? getStore('navigationBarHeight') : 46;
			return state.navigationBarHeight
		},
		capsuleMessage:(state) => {
			state.capsuleMessage = getStore('capsuleMessage') ? getStore('capsuleMessage') : {};
			return state.capsuleMessage
		},
		baseURL:(state) => {
			return state.baseURL
		}
	},
	mutations: {
		storeStatusBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('statusBarHeight', playLoad);
				state.statusBarHeight = playLoad
			}
		},
		storeNavigationBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('navigationBarHeight', playLoad);
				state.navigationBarHeight = playLoad
			}
		},
		storeCapsuleMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('capsuleMessage', playLoad);
				state.capsuleMessage = playLoad
			}
		},
		storeDepId(state, playLoad) {
			setStore('depId', playLoad);
			state.depId = playLoad
		},
		storeProId(state, playLoad) {
			setStore('proId', playLoad);
			state.proId = playLoad
		},
		//重置公共信息的状态
		resetCommonInfoState(state) {
				Object.assign(state, getDefaultCommonState())
		}
	},
	actions: {
		resetCommitState({ commit }) {
			commit('resetCommonInfoState')
		}
	}
}
