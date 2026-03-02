<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{loadingText}}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 目的科室 -->
    <div class="transport-rice-box" v-if="showGoalDepartment">
      <ScrollSelection :columns="goalDepartmentOption" :pickerValues="goalDepartmentDefaultIndex" title="目的科室" @sure="goalDepartmentSureEvent" @cancel="goalDepartmentCancelEvent" @close="goalDepartmentCloseEvent" :isShowSearch="true" />
    </div>
    <!-- 目的房间 -->
    <div class="transport-rice-box" v-if="showGoalSpaces">
			<ScrollSelection v-model="showGoalSpaces" :pickerValues="goalSpacesDefaultIndex" :columns="goalSpacesOption" title="目的房间" :currentSelectData="currentGoalSpaces" @sure="goalSpacesSureEvent" @cancel="goalSpacesCancelEvent" @close="goalSpacesCloseEvent" :isShowSearch="true" />
		</div>
    <!-- 任务类型 -->
    <div class="transport-rice-box" v-if="showTaskType">
      <ScrollSelection :columns="taskTypeOption" :pickerValues="taskTypeDefaultIndex" title="任务类型" @sure="taskTypeSureEvent" @cancel="taskTypeCancelEvent" @close="taskTypeCloseEvent" />
    </div>
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
        <div class="message-box">
          <div class="message-one">
            <div class="message-one-left">
              优先级
            </div>
            <div class="message-one-right">
              <van-radio-group v-model="priorityRadioValue" direction="horizontal">
                <van-radio name="1" checked-color="#289E8E">正常</van-radio>
                <van-radio name="2" checked-color="#E8CB51">重要</van-radio>
                <van-radio name="3" checked-color="#F2A15F">紧急</van-radio>
                <van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>科室</span>
            </div>
            <div class="select-box-right">
              <span>{{ currentGoalDepartment }}</span>
              <van-icon name="arrow" color="transparent" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>目的房间</span>
            </div>
            <div class="select-box-right" @click="goalSpacesClickEvent">
              <span>{{ currentGoalSpaces }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box">
            <div class="select-box-left">
              <span>*</span>
              <span>任务类型</span>
            </div>
            <div class="select-box-right" @click="showTaskType = true">
              <span>{{ currentTaskType }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="list-line-image">
              <div>
                <span>*</span>
                <span>问题拍照</span>
              </div>
                <div class="image-list">
                  <div v-for="(item, index) in problemPicturesList" :key='index'>
                      <img :src="item" @click="enlareEvent(item)" />
                      <div class="icon-box" @click="issueDelete(index,item)">
                          <van-icon
                          name="cross"
                          color="#101010"
                          />
                      </div>
                  </div>
                  <div @click="issueClickEvent">
                    <van-icon name="plus" size="30" color="#101010" />
                  </div>
              </div>
            </div>
          <div class="concat-box">
            <div class="concat-box-left">
              <span>*</span>
              <span>联系人(姓名)</span>
            </div>
            <div class="concat-box-right">
              <van-field
                v-model="contactName"
                type="text"
                placeholder="请输入联系人姓名"
              />
            </div>
          </div>
          <div class="concat-box">
            <div class="concat-box-left">
              <span>*</span>
              <span>联系人(电话)</span>
            </div>
            <div class="concat-box-right">
              <van-field
                v-model="contact"
                type="number"
                placeholder="请输入联系人电话"
              />
            </div>
          </div>
          <div class="task-describe transport-type">
            <div class="transport-type-left">
              <span>*</span>
              <span>任务描述</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                rows="3"
                autosize
                type="textarea"
                placeholder="请输入任务描述"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="sureEvent">确认</span>
          <span class="operate-two" @click="cancelEvent">取消</span>
        </div>
      </div>
    </div>
     <!-- 问题图片删除 -->
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input name="uploadImg1" ref="inputFile" id="demo1" @change="previewFileOne" type="file" accept="image/*" />从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/*" capture="camera"/>拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import store from '@/store'
import { reportProblem, querySpace, queryDepartment, getRepairsTaskType} from '@/api/project/taskScheduling.js'
import { setStore, compress } from '@/common/js/utils'
import _ from 'lodash'
import ScrollSelection from "@/components/ScrollSelection";
import BottomSelect from "@/components/BottomSelect";
export default {
  name: "CreateRepairsTask",
  components: {
    ScrollSelection,
    BottomSelect
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      loadingText: '加载中...',
      problemOverview: '',
      taskDescribe: '',
      transportNumberValue: '',

      goalDepartmentOption: [],
      showGoalDepartment: false,
      goalDepartmentDefaultIndex: 0,
      currentGoalDepartment: '',

      goalSpacesOption: [],
      goalSpacesDefaultIndex: 0,
      showGoalSpaces: false,
      currentGoalSpaces: '请选择',

      taskTypeOption: [],
      showTaskType: false,
      taskTypeDefaultIndex: 0,
      currentTaskType: '请选择',

      priorityRadioValue: '1',
      isMeRadioValue: '1',
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      xflSelectShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      problemPicturesList: [],
      currentImgUrl: '',
      deleteInfoDialogShow: false,
      taskTypeIndex: null,
      photoBox: false,
      imgBoxShow: false,
      overlayShow: false,
      contact: '',
      contactName: ''
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: '/'})
      })
    };
    this.parallelFunction();
    this.getSpacesByDepartmentId(this.depId,false)
  },

  watch: {
  },

  computed: {
    ...mapGetters(["templateType","proId","depId"]),
    userTypeId () {
      return 0
    },
    userName() {
      return ''
    },
    workerId() {
      return 0
    },
    proName () {
      return ''
    }
  },

  methods: {
    ...mapMutations(["changeTitleTxt"]),

    onClickLeft() {
      this.$router.push({ path: "/"})
    },

    // 格式化时间
    getNowFormatDate(currentDate) {
      let currentdate;
      let strDate = currentDate.getDate();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = currentDate.getMonth() + 1;
      let hour = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      };
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      };
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + minutes
      return currentdate
    },

    // 根据科室查询空间间信息
    getSpacesByDepartmentId (depId,flag) {
      this.loadingText = '查询中...';
      this.loadingShow = true;
      this.overlayShow = true;
      this.goalSpacesOption = [];
      querySpace(this.proId,depId)
      .then((res) => {
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false;
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            for (let i = 0, len = res.data.data.length; i < len; i++) {
              this.goalSpacesOption.push({
                text: res.data.data[i].spaceName,
                value: res.data.data[i].id,
                selected: false
              })
            }
          };
          if (flag) {this.showGoalSpaces = true}
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

    // 并行查询任务类型
    parallelFunction (type) {
        this.loadingText = '加载中...';
        this.loadingShow = true;
        this.overlayShow = true;
        Promise.all([this.getTaskType(),this.getDepartmentMessage()])
        .then((res) => {
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.length > 0) {
            this.taskTypeOption = [];
            this.goalDepartmentOption = [];
            let [item1,item2] = res;
            if (item1) {
              // 任务类型
              for (let i = 0, len = item1.length; i < len; i++) {
                this.taskTypeOption.push({
                  text: item1[i].typeName,
                  value: item1[i].id,
                  id: i
                })
              }
            };
            if (item2) {
              for (let i = 0, len = item2.length; i < len; i++) {
                this.goalDepartmentOption.push({
                  text: item2[i].departmentName,
                  value:item2[i].id,
                  id: i
                })
              }
            };
            // 科室赋默认值
		        this.currentGoalDepartment = this.getDepartmentNameById(this.depId);
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

      // 根据科室id获取科室名称
      getDepartmentNameById(value) {
        return this.goalDepartmentOption.filter((item) => {return item['value'] == value })[0]['text']
      },

      // 查询科室信息
      getDepartmentMessage () {
        return new Promise((resolve,reject) => {
          queryDepartment(this.proId,'')
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
      })
    },

    // 查询任务类型
    getTaskType () {
      return new Promise((resolve,reject) => {
        getRepairsTaskType(this.proId, this.workerId)
        .then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          }
        })
        .catch((err) => {
          reject(err.message)
        })
      })
    },

    // 任务类型下拉选择框确认事件
    taskTypeSureEvent (val,value,id) {
      if (val) {
        this.currentTaskType =  val;
        this.taskTypeDefaultIndex = id;
      } else {
        this.currentTaskType = '请选择';
        this.taskTypeDefaultIndex = 0;
      };
      this.showTaskType = false
    },

    // 任务类型下拉选择框取消事件
    taskTypeCancelEvent () {
      this.showTaskType = false
    },

    // 任务类型下拉选择框关闭事件
    taskTypeCloseEvent () {
      this.showTaskType = false
    },

    // 目的科室下拉选择框确认事件
    goalDepartmentSureEvent (val,value,id) {
      if (val) {
        this.currentGoalDepartment =  val;
        this.currentGoalSpaces = [];
        this.goalDepartmentDefaultIndex = id;
        this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],false)
      } else {
        this.currentGoalDepartment = '请选择';
        this.goalDepartmentDefaultIndex = 0;
      };
      this.showGoalDepartment = false
    },

    // 目的科室列点击事件
    goalDepartmentClickEvent () {
      if (this.currentStructure == '请选择') {
        this.$toast('请选择建筑')
      } else {
        this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],true,false)
      }
    },

    // 目的科室下拉选择框取消事件
    goalDepartmentCancelEvent () {
      this.showGoalDepartment = false
    },

    // 目的科室下拉选择框关闭事件
    goalDepartmentCloseEvent () {
      this.showGoalDepartment = false
    },

    // 目的房间下拉选择框关闭事件
    goalSpacesCloseEvent () {
      this.showGoalSpaces = false
    },
    
    // 目的房间列点击事件
    goalSpacesClickEvent () {
      if (this.currentGoalDepartment == '请选择') {
        this.$toast('请选择科室')
      } else {
        this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],true)
      }
    },

    // 目的房间下拉选择框确认事件
    goalSpacesSureEvent (val,value,id) {
      if (val.length > 0) {
        this.goalSpacesDefaultIndex = 0;
        this.currentGoalSpaces =  val;
      } else {
        this.currentGoalSpaces = '请选择'
      };
      this.showGoalSpaces = false
    },

    // 目的房间下拉选择框取消事件
    goalSpacesCancelEvent () {
      this.showGoalSpaces = false
    },
    
    // 问题图片放大事件
    enlareEvent (item) {
      this.currentImgUrl = item;
      this.imgBoxShow = true
    },

    // 问题图片拍照点击
    issueClickEvent () {
      this.isIssuePhoto = true;
      this.isRepairPhoto = false;
      if (this.problemPicturesList.length >= 9) {
        this.$toast('至多只能上传9张问题图片!');
        return
      };
      this.photoBox = true;
      this.overlayShow = true
    },

    // 图片确定删除提示框确定事件(问题图片)
    sureDeleteEvent () {
      this.problemPicturesList.splice(this.imgIndex, 1)
    },

    // 问题拍照照片删除
    issueDelete (index,item) {
      this.deleteInfoDialogShow = true;
      this.imgIndex = index;
      this.imgDeleteUrl = item
    },

    // 图片上传预览
    previewFileOne() {
      let file = document.getElementById("demo1").files[0];
      this.temporaryFile = file;
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 5;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传图片大小不能超过5MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        _this.$refs.inputFile.value = null;
        _this.photoBox = false;
        _this.overlayShow = false;
        return
      };  
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img);
          _this.problemPicturesList.push(src)
          _this.photoBox = false;
          _this.overlayShow = false
        };
        _this.$refs.inputFile.value = null;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    //拍照预览
    previewFileTwo() {
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 5;
      if (!isLt2M) {
        _this.$dialog.alert({
          message: '上传图片大小不能超过5MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };  
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img);
          _this.problemPicturesList.push(src)
          _this.photoBox = false;
          _this.overlayShow = false
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    // 拍照取消
    photoCancel () {
      this.photoBox = false;
      this.overlayShow = false
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentImgUrl = item;
      this.imgBoxShow = true
    },


    // 确认事件(问题上报)
    sureEvent () {
      // 任务类型不能为空
      if (this.currentTaskType == '请选择') {
        this.$toast('任务类型不能为空');
        return
      };
      // 问题拍照不能为空
      if (this.problemPicturesList.length == 0) {
        this.$toast('问题拍照不能为空');
        return
      };
      // 联系人姓名不能为空
      if (this.contactName === '') {
        this.$toast('请输入联系人姓名');
        return
      };
      // 联系人电话不能为空
      if (this.contact === '') {
        this.$toast('请输入联系人电话');
        return
      };
      // 联系方式校验
      if(!(/^1[3-9]\d{9}$/.test(this.contact))){
        this.$toast("联系人电话有误，请重新填写");
        return
      }; 
      // 任务描述不能为空
      if (this.taskDescribe === '') {
        this.$toast('请输入任务描述'); 
        return
      };
      // 创建维修任务
      let temporaryMessage = {
        	typeId: this.taskTypeOption.filter((item) => { return item['text'] == this.currentTaskType})[0]['value'], // 任务类型id
					typeName: this.currentTaskType, // 任务类型名称
					depName: this.currentGoalDepartment, //科室名称
					depId: this.depId, // 目的科室id
					spaceId: this.currentGoalSpaces == '请选择' ? '' : this.goalSpacesOption.filter((item) => { return item['text'] == this.currentGoalSpaces})[0]['value'], //目的房间id
					space: this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces, //目的房间名称
					priority: this.priorityRadioValue,
					taskDesc: this.taskDescribe, //任务描述
					proId: this.proId,
					workerId: this.workerId,
					workerName: '',
					flag: 1,
					images: this.problemPicturesList, // 问题图片信息 必输
					createType: 10,
          contact: this.contact, //联系方式
          contactName: this.contactName, // 联系人姓名
					flag: 1 // 上报人类型，0-维修人员，1-医护人员
      };
      this.postGenerateRepairsTask(temporaryMessage)
    },

    // 生成维修任务
    postGenerateRepairsTask (data) {
      this.loadingText = '创建中...';
      this.loadingShow = true;
      this.overlayShow = true;
      reportProblem(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.$router.push({ path: "/"})
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        };
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
    },

    // 取消事件
    cancelEvent () {
      this.$router.push({ path: "/"})
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
    .content-wrapper();
    .choose-photo-box {
      position: fixed;
      margin: auto;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 200000;
      font-size: 0;
    > div {
      width: 100%;
      text-align: center;
      font-size: 16px;
      background: #f6f6f6
    }
    .choose-photo {
      padding: 8px 10px;
      height: 30px;
      .bottom-border-1px(#cbcbcb);
      line-height: 30px;
      position: relative;
      cursor: pointer;
      color: @color-theme;
      overflow: hidden;
      display: inline-block;
      *display: inline;
      *zoom: 1;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 30px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer
      }
    };
    .photo-graph {
      position: relative;
      display: inline-block;
      height: 50px;
      overflow: hidden;
      .bottom-border-1px(#cbcbcb);
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 50px;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 50px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        height: 100%;
        top: 0;
        opacity: 0;
      }
    };
    .photo-cancel {
      position: relative;
      display: inline-block;
      padding: 8px 12px;
      overflow: hidden;
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 30px;
      font-weight: bold
    }
  };
  .img-dislog-box {
    /deep/ .van-dialog {
      top: 50% !important;
      max-height: 98vh;
      display: flex;
      flex-direction: column;
      .van-dialog__content {
        flex: 1;
        overflow: auto;
        >img {
          width: 100%;
        }
      };
      .van-dialog__footer {
        .van-dialog__confirm {
          background: #f2f2f2
        }
      }
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
        .message-box {
          flex: 1;
          width: 100%;
          overflow: scroll;
          .message-one {
            width: 100%;
            padding: 10px 6px 10px 16px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .message-one-left {
              width: 20%;
              color: #101010
            };
            .message-one-right {
              flex: 1;
              /deep/ .van-radio-group {
                justify-content: space-between;
                .van-radio--horizontal {
                  margin-right: 0 !important;
                  &:nth-child(1) {
                    .van-radio__label {
                      color: #289E8E !important
                    }
                  };
                  &:nth-child(2) {
                    .van-radio__label {
                      color: #E8CB51 !important
                    }
                  };
                  &:nth-child(3) {
                    .van-radio__label {
                      color: #F2A15F !important
                    }
                  };
                  &:nth-child(4) {
                    .van-radio__label {
                      color: #E86F50 !important
                    }
                  }
                }
              }
            }
          };
          .is-me {
            .message-one-left {
              color: #9E9E9A !important
            };
             .message-one-right {
              flex: 1;
              /deep/ .van-radio-group {
                justify-content: flex-end;
                .van-radio--horizontal {
                  &:nth-child(1) {
                    margin-right: 20px !important;
                    .van-radio__label {
                      color: #101010 !important
                    }
                  };
                  &:nth-child(2) {
                    .van-radio__label {
                      color: #101010 !important
                    }
                  };
                }
              }
            }
          };
           .list-line-image {
                display: flex;
                flex-direction: row;
                background: #fff;
                align-items: center;
                margin-top: 10px;
                padding: 10px 0 10px 0;
                box-sizing: border-box;
                >div {
                  &:first-child {
                    font-size: 14px;
                    color: #9E9E9A; 
                    height: 40px;
                    line-height: 40px;
                    padding-left: 6px;
                    box-sizing: border-box;
                    >span {
                      &:first-child {
                        color: red !important;
                      }
                    }
                  }
                };
                .image-list {
                  flex: 1;
                  flex-wrap: wrap;
                  display: flex;
                  padding: 0 10px;
                  box-sizing: border-box;
                  >div {
                      width: 32%;
                      height: 100px;
                      vertical-align: top;
                      margin-right: 2%;
                      margin-top: 2%;
                      position: relative;
                      &:nth-child(1) {
                          margin-top: 0;
                      };
                      &:nth-child(2) {
                          margin-top: 0;
                      };
                      &:nth-child(3) {
                          margin-top: 0;
                      };
                      &:nth-child(3n+3) {
                          margin-right: 0;
                      };
                      .icon-box {
                          position: absolute;
                          top: 2px;
                          right: 2px;
                          /deep/ .van-icon {
                            font-weight: bold;
                          }  
                      };
                      img {
                          width: 100%;
                          height: 100%
                      };
                      &:last-child {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background: #f2f2f2;
                          /deep/ .van-icon{
                              position: relative;
                              top: 0;
                              right: 0;
                          }
                      }
                  }
                }
              };
          .select-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .select-box-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            };
            .select-box-right {
              flex: 1;
              justify-content: flex-end;
              align-items: center;
              display: flex;
              width: 0;
              >span {
                color: #101010;
                text-align: right;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
            .select-box-left {
              padding: 0 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
          };
          .problem-overview {
            align-items: center
          };
          .concat-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            margin-top: 6px;
            .concat-box-left {
              width: 105px;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            };
            .concat-box-right {
              flex: 1;
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            } 
          };
          .transport-type {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              width: 105px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red;
                };
                &:nth-child(2) {
                  color: #9E9E9A
                }
              }
            };
            .transport-type-right {
              flex: 1;
              width: 0;
              display: flex;
              flex-wrap: wrap;
              .transport-type-list {
                display: inline-block;
                font-size: 13px;
                color: #9E9E9A;
                background: #F9F9F9;
                text-align: center;
                border-radius: 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                line-height: 20px;
                padding: 6px 10px;
                box-sizing: border-box
              };
              .transportTypeListStyle {
                color: #fff !important;
                background: #3B9DF9 !important
              }
            }
          };
          .transport-type {
            .transport-type-right {
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          };
          .consumable-management-area {
            width: 100%;
            padding: 8px 20px;
            box-sizing: border-box;
            background: #fff;
            font-size: 14px;
            margin-top: 6px;
            .circulation-area {
             
            > p {
              height: 50px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              background: #F8F8F8;
              margin-bottom: 4px;
              &:last-child {
                margin-bottom:0
              };
              > span {
                height: 50px;
                line-height: 50px;
                font-size: 16px;
                display: inline-block;
                text-align: center;
                &:first-child {
                  width: 10%
                };
                &:nth-child(2) {
                  text-align: left;
                  flex: 1;
                  .no-wrap();
                  /deep/ .van-cell {
                    .van-cell__value--alone {
                      .van-field__control {
                        text-align: center
                      }
                    }
                  }
                };
                &:nth-child(3) {
                  margin-right: 4px;
                  /deep/ .van-stepper {
                    .van-stepper__minus {
                      color: #3B9DF9;
                      border-left: 1px solid #b5b5b5;
                      border-top: 1px solid #b5b5b5;
                      border-bottom: 1px solid #b5b5b5;
                      &:before {
                        height: 3px
                      }
                    };
                    .van-stepper__input {
                      border: 1px solid #b5b5b5;
                      width: 45px;
                      margin: 0 !important
                    };
                    .van-stepper__plus {
                      color: #3B9DF9;
                      border-right: 1px solid #b5b5b5;
                      border-top: 1px solid #b5b5b5;
                      border-bottom: 1px solid #b5b5b5;
                      &:before {
                        height: 3px
                      };
                      &:after {
                        width: 3px
                      }
                    }
                  }
                };
                &:last-child {
                  display: inline-block;
                  font-size: 22px;
                  color: @color-theme;
                  /deep/ .van-icon {
                    top: 2px
                  }
                }
              }
            }
          };
          .circulation-area-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 30px;
            margin-bottom: 8px;
            >span {
              font-size: 14px;
              display: inline-block;
              &:first-child {
                color: #101010
              };
              &:last-child {
                width: 55px;
                height: 23px;
                border-radius: 4px;
                text-align: center;
                line-height: 23px;
                background: #3B9DF9;
                color: #fff;

              }
            }
          }
          }
        };
        .btn-box {
          width: 90%;
          margin: 0 auto;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          >span {
            width: 35%;
            display: inline-block;
            height: 45px;
            font-size: 14px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 4px;
            &:nth-child(1) {
              color: #fff;
              background: #2B98FE;
              box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
              margin-right: 30px
            };
            &:nth-child(2) {
              color: #2B98FE;
              border: 1px solid #2B98FE;
              box-sizing: border-box;
              box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
            }
          }
        }
    }
  }
}
</style>