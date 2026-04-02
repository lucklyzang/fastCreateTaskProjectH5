<template>
	<div class="content">
		<van-overlay :show="overlayShow" z-index="100000" custom-style="{opacity:.6}"/>
		<div class="top-background-area"></div>
		<!-- 顶部标题 -->
		<div class="topTabbar" :style="{ 'height': navigationBarHeight + 'px', 'lineHeight': navigationBarHeight + 'px'}">
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
				overlayShow: false,
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
				]
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
		
		beforeRouteEnter(to, from, next) {
			if (from.path === '/') {
				next((vm)=>{
					vm.getCodeMessage()
				})
			} else {
				next()
			}
		},

		mounted() {
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
					if (depId === '' || depId === undefined || depId === null) {
						// 取不到科室id,禁止后续操作
						this.overlayShow = true;
						this.$dialog.alert({
							message: '请先扫描下单二维码',
							closeOnPopstate: true,
							showConfirmButton: false
						}).then(() => {
						})
					} else {
						this.storeDepId(depId);
					}
                } else {
					// 取不到科室id,禁止后续操作
					this.overlayShow = true;
					this.$dialog.alert({
						message: '请先扫描下单二维码',
						closeOnPopstate: true,
						showConfirmButton: false
					}).then(() => {
					})
				};
                if (window.location.href.indexOf("proId") != -1) {
                    let proId = getUrlParam('proId');
					if (proId === '' || proId === undefined || proId === null) {
						// 取不到项目id,禁止后续操作
						this.overlayShow = true;
						this.$dialog.alert({
							message: '请先扫描下单二维码',
							closeOnPopstate: true,
							showConfirmButton: false
						}).then(() => {
						})
					} else {
						this.storeProId(proId);
					}
                } else {
					// 取不到项目id,禁止后续操作
					this.overlayShow = true;
					this.$dialog.alert({
						message: '请先扫描下单二维码',
						closeOnPopstate: true,
						showConfirmButton: false
					}).then(() => {
					})
				}
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
		/deep/ .van-overlay {
			opacity: .1;
		};
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
			justify-content: center;
			position: relative;
			background: #fff;
			.title-center {
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