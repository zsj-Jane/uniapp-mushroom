<template>
  <view class="home-container">
    <!-- 搜索框 -->
    <searchBar tipName="请输入课程名称"></searchBar>
    <!-- 轮播图 -->
    <swiper
      class="swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="1000"
      :circular="true"
    >
      <navigator
        v-for="item in swipers"
        :key="item.id"
        :url="'/pages/course-detail/index?id='+item.course_id"
        redirect
      >
        <swiper-item>
          <image :src="item.img_url" mode />
        </swiper-item>
      </navigator>
    </swiper>
    <!-- 推荐课程 -->
    <view @click="goToCourse" class="tips">
      <text>推荐课程</text>
      <image src="/static/images/arrow@2x.png" mode />
    </view>
    <scroll-view scroll-x="true" class="course-container">
      <navigator
        :url="'/pages/course-detail/index?id='+item.relation_id"
        class="course-item"
        v-for="item in courses"
        :key="item.id"
      >
        <image :src="item.icon" mode />
      </navigator>
    </scroll-view>
    <!-- 热门视频 -->
    <view @click="goToCourseDetail(3)" class="tips">
      <text>热门视频</text>
      <image src="/static/images/arrow@2x.png" mode />
    </view>
    <view class="hot-video">
      <navigator
        :url="'/pages/course-detail/index?id='+item.course_id"
        class="video-item"
        v-for="item in videos"
        :key="item.id"
      >
        <image :src="item.cover_photo_url" mode />
        <view class="title">{{item.name}}</view>
        <view class="subtitle">{{item.view_count}}人次已观看</view>
      </navigator>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import request from "../../utils/request";
import searchBar from "../../components/search-bar/index.vue";
export default Vue.extend({
  components: {
    searchBar
  },
  data() {
    return {
      // 轮播图
      swipers: [],
      // 推荐课程
      courses: [],
      // 热门视频
      videos: []
    };
  },
  onLoad() {
    // 获取轮播图数据
    this.getSwipersData();
    // 获取推荐课程数据
    this.getCoursesData();
    // 获取热门视频数据
    this.getVideosData();
  },
  methods: {
    // 获取轮播图数据
    async getSwipersData() {
      let res: any = await request({ url: "home/swipers" });
      if (res.data.status === 0) {
        this.swipers = res.data.message;
      }
    },
    // 获取推荐课程数据
    async getCoursesData() {
      let res: any = await request({ url: "home/course" });
      if (res.data.status === 0) {
        this.courses = res.data.message;
      }
    },
    // 获取热门视频数据
    async getVideosData() {
      let res: any = await request({ url: "home/video" });
      if (res.data.status === 0) {
        this.videos = res.data.message;
      }
    },
    // 跳转到课程页面
    goToCourse() {
      uni.switchTab({
        url: "/pages/course/index"
      });
    },
    // 跳转到课程详情页面
    goToCourseDetail(id:Number) {
      uni.navigateTo({
        url: `/pages/course-detail/index?id=${id}`
      });
    }
  }
});
</script>

<style lang="less" scoped>
.home-container {
  padding: 20rpx;
  background-color: #fff;
}
swiper {
  width: 100%;
  height: 342rpx;
  swiper-item {
    width: 100%;
    height: 100%;
  }
  image {
    width: 100%;
    height: 100%;
  }
}
.tips {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text {
    font-size: 36rpx;
    font-weight: 700;
    color: #212121;
  }
  image {
    width: 48rpx;
    height: 48rpx;
  }
}
.course-container {
  height: 170rpx;
  white-space: nowrap;
  .course-item {
    width: 296rpx;
    height: 168rpx;
    display: inline-block;
    margin-right: 32rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.hot-video {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item {
    width: 340prx;
    image {
      width: 340rpx;
      height: 210rpx;
      border-radius: 12rpx;
    }
    .title {
      margin-top: 15rpx;
      color: #262626;
      font-size: 26rpx;
    }
    .subtitle {
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      color: #959595;
      font-size: 18rpx;
    }
  }
}
</style>
