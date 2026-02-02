
// 公共信息store的初始值
export function getDefaultCommonState() {
	return {
		//状态栏高度
		statusBarHeight: 0,
		//导航栏栏高度
		navigationBarHeight: 0,
		// 胶囊信息
		capsuleMessage: {},
		templateType: 'template_two',
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
		// 任务调度类型
		schedulingTaskType: {},
		// 任务调度详情
		schedulingTaskDetails: {},
		//操作按钮点击记录
		operateBtnClickRecord: {
		  allocationBtnClick: false,
		  delayBtnClick: false,
		  cancelBtnClick: false
		},
		// 暂存创建调度任务的信息
		temporaryStorageCreateDispathTaskMessage: {},
		// 暂存创建预约任务的信息
		temporaryStorageCreateAppointTaskMessage: {},
		//运送类型信息
		transParentMessage: {}
	}
}

/*
 * 工程维修相关模块store初始值
*/

// taskScheduling模块store的初始值
export function getDefaultTaskSchedulingState() {
    return {
		// 任务调度相关信息
		schedulingTaskAboutMessage: {},
		// 暂存创建维修任务的信息
		temporaryStorageCreateRepairsTaskMessage: {}
    }
}