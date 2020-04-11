<template>
  <view class="course-container">
    <view v-for="item in courses" :key="item.id" class="course-item">
      <image class="img" :src="item.icon" mode />
      <text class="title">{{item.title}}</text>
      <text class="subtitle">{{item.subtitle}}</text>
      <view class="level">
        <text v-if="item.level==1">初级</text>
        <text v-else-if="item.level==2">中级</text>
        <text v-else>高级</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    courses: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  methods: {}
});
</script>

<style lang="less" scoped>
.course-container {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 32rpx;
}
.course-item {
  margin-left: 32rpx;
  margin-top: 32rpx;
  border-radius: 12rpx;
  background-color: white;
  width: 333rpx;
  height: 368rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    margin-top: 58rpx;
    width: 124rpx;
    height: 124rpx;
  }
  .title {
    margin-top: 28rpx;
    color: #333333;
    font-weight: bold;
    font-size: 32rpx;
  }
  .subtitle {
    color: #a8a8a8;
    font-size: 22rpx;
    margin-top: 12rpx;
  }
  .level {
    margin-top: 20rpx;
    color: #ffb37a;
    text-align: center;
    font-size: 24rpx;
    line-height: 32rpx;
    width: 92rpx;
    height: 32rpx;
    border: 2rpx solid rgba(255, 179, 122, 1);
    opacity: 1;
    border-radius: 16rpx;
  }
}
</style>