
// 公共信息store的初始值
export function getDefaultCommonState() {
	return {
		//状态栏高度
		statusBarHeight: 0,
		//导航栏栏高度
		navigationBarHeight: 0,
		// 胶囊信息
		capsuleMessage: {},
		templateType: 'template_one',
		// 开发环境： http://blink.blinktech.cn/nblink
		// 测试环境：http://show.blinktech.cn/nblink
		// 准生产环境：http://ver.blinktech.cn/nblink
		// 生产环境：http://blinktech.cn/nblink
		// 新测试环境  http://act.blinktech.cn/nblink
		baseURL: 'http://ver.blinktech.cn',
		depId: '',
		proId: ''
	}
}

/*
 * 中央运送相关模块store初始值
*/
//taskScheduling store初始值
export function getDefaultTransTaskSchedulingState() {
	return {
		//运送类型信息
		transParentMessage: {}
	}
}