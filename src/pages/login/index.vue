<template>
  <view class="login-container">
    <image class="logo" src="/static/images/silkbag.png" mode />
    <text class="title">锦囊在线</text>
    <image class="login-tips" src="/static/images/login_tips@2x.png" mode />
    <button @getuserinfo="getUserInfo" open-type="getUserInfo" plain class="wx-login-button">
      <image class="wx-login-img" src="/static/images/wx_login@2x.png" mode />
    </button>
    <view class="phone-login">手机号登录</view>
    <text class="bottom-tip">Copyright © 2020 锦囊在线</text>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import request from "../../utils/request";
export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    // 获取用户信息
    getUserInfo(e: any) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        // 若微信授权不成功，则返回
        return;
      } else {
        // 获取用户信息中的头像、昵称
        const { avatarUrl: avatar, nickName: nickname } = e.detail.userInfo;
        // 调用wx.login接口，拿到临时code
        uni.login({
          provider: "weixin",
          success: async ({ code }) => {
            // 发送请求，微信授权登录
            const res: any = await request({
              url: "user/wxlogin",
              method: "POST",
              data: { code, nickname, avatar },
              tipName: "微信授权登录中..."
            });
            // 当登录成功后
            if (res.data.status === 0) {
              // 消息提示
              uni.showToast({
                title: res.data.message,
                icon: "none",
                duration: 1000
              });
              // 本地保存token
              uni.setStorageSync("my_token", res.data.token);
              // 跳转到首页
              uni.switchTab({
                url: "/pages/home/index"
              });
            }
          }
        });
      }
    },
  }
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    margin-top: 180rpx;
    width: 212rpx;
    height: 212rpx;
  }
  .title {
    color: #333333;
    font-size: 24px;
    margin-top: 20rpx;
  }
  .login-tips {
    margin-top: 30rpx;
    height: 34rpx;
    width: 292rpx;
    position: relative;
  }
  .wx-login-button {
    margin-top: 200rpx;
    width: 568rpx;
    height: 98rpx;
    padding: 0;
    border: none;
  }
  .wx-login-img {
    // margin-top:200rpx;
    width: 568rpx;
    height: 98rpx;
  }
  .phone-login {
    margin-top: 40rpx;
    color: #333333;
    font-size: 15px;
  }
  .bottom-tip {
    color: #a8a8a8;
    font-size: 10px;
    position: absolute;
    bottom: 40rpx;
  }
}
.wx-login-container {
  position: relative;
  .wx-login-tip1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 450rpx;
    padding-top: 50rpx;
    img {
      width: 198rpx;
      height: 198rpx;
    }
    p {
      color: #bebebe;
      margin-top: 50rpx;
      font-size: 13px;
    }
  }
  .wx-login-tip1-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 500rpx;
    background: rgba(0, 0, 0, 1);
    opacity: 0.16;
  }
}
</style>