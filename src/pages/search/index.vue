<template>
  <view class="search-container">
    <!-- 自己写的方法 -->
    <!-- <view class="search-head">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="请输入课程名称"
        type="text"
        @focus="focus"
        @confirm="search"
      />
      <icon class="icon-search" type="search" size="15"></icon>
      <text v-show="isFocus" @click="cancel" class="search-button">取消</text>
    </view>-->
    <view class="search-head">
      <!-- 使用uni-ui插件 -->
      <uni-search-bar
        class="search-bar"
        type="text"
        :radius="100"
        @cancel="cancel"
        @confirm="search"
      ></uni-search-bar>
    </view>
    <view class="search-body">
      <view class="empty" v-if="courses.length==0">
        <text class="title">暂无内容</text>
      </view>
      <view v-else>
        <courseList :courses="courses"></courseList>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import request from "../../utils/request";
import courseList from "../../components/course-list/index.vue";
import uniSearchBar from "@dcloudio/uni-ui//lib/uni-search-bar/uni-search-bar.vue";
export default Vue.extend({
  components: {
    courseList,
    uniSearchBar
  },
  data() {
    return {
      // 自己写的
      keyword: "",
      isFocus: false,
      // 课程信息
      courses: []
    };
  },
  methods: {
    // 自己写的搜索框的方法
    // focus() {
    //   this.isFocus = true
    // },
    // cancel() {
    //   this.keyword = ''
    //   this.isFocus = false
    //   this.search();
    // },
    // async search() {
    //   let res: any = await request({
    //     url: "course/search",
    //     data: {
    //       name: this.keyword
    //     }
    //   });
    //   if (res.data.status === 0) {
    //     this.courses = res.data.message;
    //   }
    // },
    // 使用uni-ui插件，写的方法
    async search(e: any) {
      let res: any = await request({
        url: "course/search",
        data: {
          name: e.value
        }
      });
      if (res.data.status === 0) {
        this.courses = res.data.message;
      }
    }
  }
});
</script>

<style lang="less" scoped>
.search-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.search-head {
  padding: 30rpx 0;
  background-color: #fff;
  display: flex;
}
.search-bar {
  width: 100%;
}
.search-input {
  margin-left: 30rpx;
  margin-right: 30rpx;
  padding-left: 55rpx;
  width: 100%;
  height: 74rpx;
  background: rgba(243, 243, 243, 1);
  opacity: 1;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
}
.icon-search {
  position: absolute;
  left: 40rpx;
  top: 48rpx;
  width: 56rpx;
  height: 56rpx;
  color: #a8a8a8;
}
.search-button {
  margin-right: 30rpx;
  width: 100rpx;
  height: 74rpx;
  line-height: 74rpx;
  text-align: center;
  color: #ff951c;
}
.search-body {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 32rpx;
  width: 100%;
  height: 100%;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 600rpx;
}
.empty .title {
  font-size: 14px;
  color: gray;
}
</style>