<template>
  <view class="container">
    <view class="star-bg">
      <!-- 5个空心打底 -->
      <image v-for="item in 5" :key="item" src="/static/images/star_empty@2x.png" mode />
    </view>
    <view class="star">
      <!-- 按评分显示实心个数 -->
      <image v-for="item in score" :key="item" src="/static/images/star_fill@2x.png" mode />
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    score: {
      type: Number,
      default: 5
    }
  },
  mounted() {
    console.log(this.score);
  }
});
</script>

<style lang="less">
.container {
  position: relative;
}
.star,
.star-bg {
  float: left;
  display: flex;
  height: 50rpx;
  align-items: center;
  image {
    width: 38rpx;
    height: 36rpx;
  }
}
.star {
  position: absolute;
  top: 0;
  left: 0;
}
</style>