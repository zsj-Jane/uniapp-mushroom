<template>
  <view class="phone-login-container">
    <view class="phone-validate">手机号验证</view>
    <view class="subtitle">用于即时获取课程最新信息</view>
    <view class="content">
      <input v-model="phone" class="phone" type="number" placeholder="请输入您的手机号" />
      <view
        @click="getVcode"
        :style="{color:isCountDown?'#a8a8a8':'#000'}"
        class="get_vcode"
      >{{tipName}}</view>
      <input v-model="vcode" class="vcode" type="number" placeholder="请输入验证码" />
    </view>
    <view @click="phoneLogin" class="phone-login">
      <image src="/static/images/phone_login@2x.png" mode />
    </view>
  </view>
</template>

<script>
import Vue from "vue";
import request from "../../utils/request.ts";
export default Vue.extend({
  data() {
    return {
      phone: "17704051019",
      vcode: "",
      tipName: "获取验证码",
      count: 10,
      // 是否正在倒计时
      isCountDown: false,
      // 计时器id
      timerId: ""
    };
  },
  methods: {
    // 获取验证码
    async getVcode() {
      // 1. 检测手机号是否合法
      const reg = /^1[3456789][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        uni.showToast({
          title: "手机号不合法",
          icon: "none",
          duration: 1000
        });
        return;
      }
      // 2.倒计时
      // 已经在倒计时时，点击无效
      if (this.isCountDown) {
        return;
      }
      // 将倒计时的数据赋值给tipName，显示
      this.tipName = this.count;
      // 倒计时状态
      this.isCountDown = true;
      // 开启定时器，每隔1s，count--
      this.timerId = setInterval(() => {
        if (this.count <= 1) {
          // 清除定时器
          clearInterval(this.timerId);
          // 恢复初始值
          this.isCountDown = false;
          this.count = 10;
          this.tipName = "获取验证码";
          // 退出
          return;
        }
        this.count--;
        this.tipName = this.count;
      }, 1000);
      // 3.发送请求，获取验证码
      let res = await request({
        url: "user/vcode",
        data: {
          phone: this.phone
        }
      });
      // 当请求成功后
      if (res.data.status === 0) {
        // 验证码提示
        uni.showToast({
          title: `验证码为${res.data.vcode}`,
          icon: "none",
          duration: 2000
        });
      }
    },
    // 手机号登录
    async phoneLogin() {
      let res = await request({
        url: "user/login",
        method: "POST",
        data: {
          phone: this.phone,
          vcode: this.vcode
        }
      });
      // 消息提示
      uni.showToast({
        title: res.data.message,
        icon: "none",
        duration: 1000
      });
      // 当请求成功后
      if (res.data.status === 0) {
        // 本地保存token
        uni.setStorageSync("my_token", res.data.token);
        // 跳转到首页
        uni.switchTab({
          url: "/pages/home/index"
        });
      }
    }
  }
});
</script>

<style lang="less" scoped>
.phone-login-container {
  padding: 0rpx 68rpx;
  .phone-validate {
    margin-top: 100rpx;
    color: #393939;
    font-size: 43px;
  }
  .subtitle {
    margin-top: 20rpx;
    color: #a8a8a8;
    font-size: 30rpx;
  }
  .content {
    margin-top: 150rpx;
    height: 250rpx;
    position: relative;
    .phone {
      height: 100rpx;
      font-size: 15px;
      // background-color: green;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
    .get_vcode {
      position: absolute;
      right: 0;
      top: 20rpx;
      width: 164rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      font-size: 24rpx;
      color: #a8a8a8;
      border: 1px solid rgba(168, 168, 168, 1);
      border-radius: 20px;
      z-index: 2;
    }
    .vcode {
      margin-top: 30px;
      height: 100rpx;
      font-size: 15px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
  }
  .phone-login {
    margin-top: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 568rpx;
      height: 98rpx;
    }
  }
}
</style>