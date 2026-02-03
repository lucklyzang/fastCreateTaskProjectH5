<template>
	<div class="page-box">
        <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ infoText }}</van-loading>
        <van-overlay :show="overlayShow" z-index="100000" />
		<div class="nav">
            <van-nav-bar
                title="任务呼叫"
                left-text="返回"
                :left-arrow="true"
                :placeholder="true"
                :border="false"
                :fixed="true"
                z-index="1000"
                :safe-area-inset-top="true"
                @click-left="onClickLeft"
            >
            </van-nav-bar>
        </div>
		<div class="content">
            <div class="content-top-area">
                <img :src="statusBackgroundPng" />
            </div>
            <div class="content-box">
                <div class="trans-type">
                    <div class="trans-type-title">
                        运送类型
                    </div>
                    <div class="trans-type-content">
                        <div class="trans-list" v-for="(item,index) in transTypeList" :key="item.value" @click="transTypeEvent(item,index)">
                            <div class="list-top">
                                <img :src="circleBackgroundPng"/>
                                <img v-if="item.text == '标本'" :src="sampleIconPng" />
                                <img v-if="item.text == '检查'" :src="examineIcondPng"/>
                                <img v-if="item.text == '药物文书'" :src="medicineIconPng"/>
                            </div>
                            <div class="list-bottom">{{ item.text }}</div>
                        </div>
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
    import { queryTransportTypeClass } from '@/api/trans/medicalPort.js'
    import { IsPC } from '@/common/js/utils'
	export default{
		data() {
			return {
				loadingShow: false,
                overlayShow: false,
				infoText: '加载中···',
                transTypeList: [],
                statusBackgroundPng: require("@/common/images/home/status-background.png"),
                circleBackgroundPng: require("@/common/images/home/circle-background.png"),
                sampleIconPng: require("@/common/images/home/sample-icon.png"),
                examineIcondPng: require("@/common/images/home/examine-icon.png"),
                medicineIconPng: require("@/common/images/home/medicine-icon.png")
			}
		},
		computed: {
			...mapGetters([
				'navTopTitle',
				'navigationBarHeight',
                'proId'
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
            // 控制设备物理返回按键测试
            if (!IsPC()) {
                let that = this;
                pushHistory();
                that.gotoURL(() => {
                    pushHistory();
                    that.$router.push({path: '/'})
                })
            };
            this.parallelFunctionTwo();
		},
		
		methods: {
			...mapMutations([
				'changeTransParentMessage',
			]),

            onClickLeft() {
                this.$router.push({ path: "/"})
            },

			// 运送类型点击事件
            transTypeEvent (item,index) {
                this.changeTransParentMessage(item);
                this.$router.push({ path: "/createDispathTask"})
            },
		 
            //运送类型
            parallelFunctionTwo() {
                this.loadingText = '加载中...';
                this.loadingShow = true;
                this.overlayShow = true;
                Promise.all([this.getTransportsType()])
                    .then((res) => {
                        this.loadingText = '';
                        this.loadingShow = false;
                        this.overlayShow = false;
                        if (res && res[0] && res[0].length > 0) {
                            let [item1] = res;
                            if (item1) {
                                this.transTypeList = [];
                                for (let item of item1) {
                                    if (item.typeName == '标本' || item.typeName == '检查' || item.typeName == '药、物、文书') {
                                        this.transTypeList.push({
                                            value: item.id,
                                            text: item.typeName == '药、物、文书' ?  item.typeName.replace(/、/g,'') : item.typeName
                                        })
                                    }	
                                };
                                let needList = this.transTypeList.filter((item) => { return item.text == '药物文书' })[0];
                                this.transTypeList = this.transTypeList.filter((item) => { return item.text != '药物文书' });
                                this.transTypeList.push(needList)
                            }
                        }
                    })
                    .catch((err) => {
                        this.loadingText = '';
                        this.loadingShow = false;
                        this.overlayShow = false;
                        this.$dialog.alert({
                            message: `${err}`,
                            closeOnPopstate: true
                        }).then(() => {})
                    })
            },
            
            // 查询运送类型分类
            getTransportsType() {
                return new Promise((resolve, reject) => {
                    queryTransportTypeClass({
                            proId: this.proId,
                            state: 0
                        }).then((res) => {
                            if (res && res.data.code == 200) {
                                resolve(res.data.data)
                            }
                        })
                        .catch((err) => {
                            reject(err.message)
                        })
                })
            }
        }
	}
</script>
<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.page-box {
    .content-wrapper();
    /deep/ .van-popup--right {
        padding: 20px 0 80px 0;
        box-sizing: border-box;
        .center-content {
        margin-top: 20px;
        }
    };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent;
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: #fff !important;
                margin-left: 8px !important;
            }
        };
        .van-nav-bar__right {
            .van-nav-bar__text {
                font-weight: bold !important
            }
        }
        .van-icon {
            color: #fff !important;
            font-size: 22px !important;
        }
        .van-nav-bar__title {
            color: #fff !important;
            font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 0;
        background: #f7f7f7;
        z-index: 10;
		 .trans-type {
		 	padding: 10px 10px 20px 10px;
		 	box-sizing: border-box;
		 	width: 98%;
		 	margin: 0 auto;
		 	background: #fff;
		 	border-radius: 10px;
		 	.trans-type-title {
		 		font-size: 16px;
		 		color: #242424;
		 		font-weight: bold;
		 		margin-bottom: 20px;
		 	};
		 	.trans-type-content {
		 		display: flex;
		 		flex-wrap: wrap;
		 		.trans-list {
					width: 25%;
		 			display: flex;
		 			flex-direction: column;
		 			.list-top {
		 				width: 55px;
		 				height: 55px;
						position: relative;
		 				>img {
							&:nth-child(1) {
								width: 55px;
								height: 55px;
								position: absolute;
								top: 0;
								left: 0
							};
							&:nth-child(2) {
								width: 24px;
								height: 24px;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%,-50%)
							};
		 				}
		 			};
		 			.list-bottom {
						width: 55px;
						text-align: center;
		 				margin-top: 10px;
		 				font-size: 16px;
		 				color: #101010;
		 			};
					&:nth-child(2) {
						width: 38% !important;
						align-items: center;
					};
					&:last-child {
						width: 37% !important;
						align-items: center;
						.list-bottom {
							width: 70px !important
						}
					}
		 		}
		 	}
        }     
    }
  }
}
</style>