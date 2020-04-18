<template>
  <view class="study-container">
    <view v-if="studyProgress">
      <view class="study-item" v-for="item in studyProgress" :key="item.sid">
        <image :src="item.icon" mode />
        <view class="meta">
          <view class="title">{{item.title}}</view>
          <view class="progress">已学习{{item.study_hour}}课时/{{item.total_hour}}课时</view>
        </view>
        <view class="circle">
          <circle :canvasId="item.sid" :width="55" :height="55" :progress="item.study_progress"></circle>
        </view>
      </view>
    </view>
    <view v-else>
      <text class="no-study-tip">您还没有任何学习记录哦，赶快去学习吧</text>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import request from "../../utils/request";
import circle from '../../components/circle/index.vue';
export default Vue.extend({
  components:{
    circle
  },
  data() {
    return {
      studyProgress: null
    };
  },
  onLoad() {
    // 获取学习进度列表
    this.getStudyProgress();
  },
  methods: {
    // 获取学习进度列表
    async getStudyProgress() {
      let res: any = await request({ url: "study/progress" });
      if (res.data.status === 0) {
        this.studyProgress = res.data.message;
      }
    }
  }
});
</script>

<style lang="less" scoped>
.study-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 32rpx;
  align-items: center;
  position: relative;
}
.study-item {
  margin-top: 32rpx;
  background-color: #fff;
  border-radius: 12rpx;
  width: 686rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  image {
    width: 108rpx;
    height: 108rpx;
    margin-left: 50rpx;
  }
  .meta {
    flex: 1;
    margin-left: 50rpx;
    .title {
      font-size: 30rpx;
      color: #333333;
    }
    .progress {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #a8a8a8;
    }
  }
  .circle {
    width: 109rpx;
    height: 109rpx;
    margin-right: 56rpx;
  }
}
.no-study-tip {
  margin-top: 500rpx;
  font-size: 15px;
}
</style>