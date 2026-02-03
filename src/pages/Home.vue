<template>
	<div class="content">
		<div class="top-background-area"></div>
		<!-- 顶部标题 -->
		<div class="topTabbar" :style="{ 'height': navigationBarHeight + 'px', 'lineHeight': navigationBarHeight + 'px'}">
				<div class="title-left">
					<img :src="homeIconPng" />
					<span>新茂医信</span>
				</div>
				<div class="title-center">
					智慧后勤服务平台
				</div>
		</div>
		<div class="home-banner-area">
            <img :src="homeBannerPng" />
		</div>
		<div class="content-box">
			<div class="service-management">
				<div class="service-management-title">
					服务管理
				</div>
				<div class="service-management-content">
					<div class="service-list" v-for="(item,index) in serviceList" :key="index" @click="serviceManagementEvent(item,index)">
						<div class="list-top">
							<img :src="item.url" />
						</div>
						<div class="list-bottom">{{ item.text }}</div>
					</div>
				</div>
			</div>
		</div>
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>  
	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { getUrlParam } from '@/common/js/utils'
	export default{
		data() {
			return {
				showLoadingHint: false,
				triangleRectListInfoShow: false,
				infoText: '加载中···',
                homeIconPng: require('@/common/images/home/home-icon.png'),
                homeBannerPng: require('@/common/images/home/home-banner.png'),
				hasAuthserviceManagementSystemsList: [],
				serviceList: [
					{
						text: '中央运送',
						value: 'trans',
						url: require('@/common/images/home/trans-icon.png')
					},
					{
						text: '工程维修',
						value: 'project',
						url: require('@/common/images/home/project-icon.png')
					}
				],
				depId: '',
				proId: ''
			}
		},
		computed: {
			...mapGetters([
				'navTopTitle',
				'navigationBarHeight'
			]),
			userTypeId () {
				return 0
			},
			userName() {
					return ''
			},
			workerId() {
				return 0
			}
		},
		
		mounted() {
			// this.getCodeMessage()
		},
		
		methods: {
			...mapMutations([
				'storeDepId',
				'storeProId'
			]),

			// 通过扫码进入获取相关参数(项目id,科室id)
            getCodeMessage () {
                if (window.location.href.indexOf("depId") != -1) {
                    let depId = getUrlParam('depId');
					if (depId === '') {
						this.storeDepId(385);
					} else {
						this.storeDepId(depId);
					}
                } else {
					this.storeDepId(385);
				};
                if (window.location.href.indexOf("proId") != -1) {
                    let proId = getUrlParam('proId');
					if (proId === '') {
						this.storeProId(7);
					} else {
						this.storeProId(proId);
					}
                } else {
					this.storeProId(7);
				};
            },

			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// px转换成rpx
			rpxTopx(px){
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = ( 750 / deviceWidth ) * Number(px);
				return Math.floor(rpx)
			},
			
			// 服务管理项点击事件
			serviceManagementEvent (item,index) {
				if (item.text == '中央运送') {
					this.$router.push({ path: "/chooseTransPartentType" })
				} else if (item.text == '工程维修') {
					this.$router.push({ path: "/createRepairsTask" })
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content {
		.content-wrapper();
		height: 100vh !important;
		padding: 0 2px;
		box-sizing: border-box;
		position: relative;
		background: #F8F8F8;
		.top-background-area {
			width: 100%;
			position: absolute;
			top: 0;
			left: 0
		};
    	.topTabbar {
			width: 100%;
			display: flex;
			box-sizing: border-box;
			align-items: center;
			position: relative;
			background: #fff;
			.title-left {
				padding-left: 8px;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				>img {
					width: 23px;
					margin-right: 2px;
					vertical-align: middle;
				};
				>span {
					font-size: 12px;
					color: #3370FF;
					vertical-align: middle;
				}
			};
			.title-center {
				flex: 1;
				padding-left: 15%;
				font-size: 14px;
				color: #101010;
			}
		};
		.home-banner-area {
			height: 150px;
			>img {
				width: 100%;
				height: 100%;
			}
		};
		.content-box {
			position: relative;
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			margin-top: 10px;
			.service-management {
				padding: 18px 10px 30px 10px;
				box-sizing: border-box;
				width: 98%;
				max-height: 25vh;
				overflow: auto;
				margin: 0 auto;
				background: #fff;
				border-radius: 10px;
				.service-management-title {
					font-size: 16px;
					color: #242424;
					font-weight: bold;
					margin-bottom: 20px;
				};
				.service-management-content {
					display: flex;
					flex-wrap: wrap;
					.service-list {
						width: 25%;
						display: flex;
						flex-direction: column;
						.list-top {
							width: 50px;
							height: 50px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #3370FF;
							border-radius: 12px;
							>img {
								width: 32px;
								height: 32px;
							}
						};
						.list-bottom {
							margin-top: 14px;
							font-size: 12px;
							color: #101010;
						}
					};
					>div {
						&:nth-child(2) {
							.list-top {
								background: #FC8F66 !important;
							} 
						};
						&:nth-child(3) {
							.list-top {
								background: #4CC9E4 !important;
							} 
						}
					}
				}
			};
			.safe-management {
				margin-top: 10px;
				max-height: 25vh;
				overflow: auto;
				>div {
					&:nth-child(2) {
							.list-top {
								background: #4CC9E4 !important;
							} 
						};
				}
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
	}
</style>