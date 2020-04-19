<template>
  <view class="course-detail-container" v-if="courseInfo">
    <!-- 基本信息 -->
    <view>
      <view v-if="!isPlaying" class="cover_image">
        <image :src="courseInfo.course.cover_image_url" mode />
        <view @click="playVideo" class="play">
          <image src="/static/images/play@2x.png" mode />
          <text>播放课程简介</text>
        </view>
      </view>
      <!-- 课程视频 -->
      <view v-else class="course_video">
        <video :src="courseInfo.course.course_video_url" controls autoplay></video>
      </view>
    </view>
    <!-- 简介 -->
    <view class="introduction">
      <view class="title-price">
        <text>{{courseInfo.course.title}}</text>
        <text>¥{{courseInfo.course.price}}</text>
      </view>
      <text class="introduce">{{courseInfo.course.introduction}}</text>
      <view class="star">
        <!-- uni-ui中的评分插件 -->
        <!-- <uni-rate size="10" :value="courseInfo.course.score"></uni-rate> -->
        <!-- 自定义评分组件 -->
        <star :score="courseInfo.course.score"></star>
        <text>{{courseInfo.course.study_count}}人在学</text>
      </view>
      <view class="study-share">
        <image src="/static/images/start_study@2x.png" mode />
        <button open-type="share" class="share-button"></button>
      </view>
    </view>
    <!-- 目录、讲师介绍、评价 -->
    <view class="catalog">
      <view class="head">
        <text
          v-for="(item,index) in menu"
          :key="item"
          :class="{active:currentIndex==index}"
          @click="toggleSelect(index)"
        >{{item}}</text>
      </view>
      <!-- 目录 -->
      <view v-if="currentIndex===0" class="catelog-container">
        <text v-for="(item,index) in courseInfo.videos" :key="item.id">{{index+1}}.{{item.name}}</text>
      </view>
      <!-- 讲师介绍 -->
      <view v-else-if="currentIndex===1" class="lecturer-container">
        <view class="info">
          <image :src="courseInfo.lecturer.avatar" mode />
          <view class="name-follow">
            <text>{{courseInfo.lecturer.name}}</text>
            <text>关注人数：{{courseInfo.lecturer.follow_count}}</text>
          </view>
          <!-- <view v-if="!courseInfo.lecturer.is_follow" class="unfollow">关注</view>
          <view v-else class="follow">已关注</view>-->
          <view
            @click="followOrUnfollow(courseInfo.lecturer)"
            :class="[courseInfo.lecturer.is_follow ? 'follow':'unfollow']"
          >{{courseInfo.lecturer.is_follow ? '已关注' :'关注'}}</view>
        </view>
        <view class="introduce">
          <text>{{courseInfo.lecturer.introduction}}</text>
        </view>
      </view>
      <!-- 评价 -->
      <view v-else>
        <view v-for="item in courseInfo.comments" :key="item.id" class="comment-item">
          <view class="info">
            <image :src="item.avatar" mode />
            <view class="nickname-content">
              <view class="nickname">
                {{item.nickname}}
                <star style="margin-left:20rpx" :score="item.score" />
              </view>
              <view>{{item.content}}</view>
            </view>
            <view class="time">{{item.comment_time}}</view>
          </view>
          <view class="star">
            <!-- 1表示为点赞，2表示点赞 -->
            <image
              @click="likeOrUnlike(item)"
              :src="item.is_like===2?'/static/images/like_highlight@2x.png':'/static/images/like_normal@2x.png'"
              mode
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request from "../../utils/request";
// 导入uni-ui中的评级组件
// import uniRate from "@dcloudio/uni-ui//lib/uni-rate/uni-rate.vue";
// 自定义评分组件
import star from "../../components/star/index.vue";
export default {
  components: {
    // uniRate,
    star
  },
  data() {
    return {
      // 课程id
      id: null,
      // 课程详情
      courseInfo: null,
      // 是否正在播放
      isPlaying: false,
      // 标签名
      menu: ["目录", "讲师介绍", "评价"],
      // 当前索引
      currentIndex: 2
    };
  },
  onLoad(options) {
    // 拿到路径上的id
    this.id = options.id;
    // 发请求，获取数据
    this.getCourseInfoData();
  },
  // 用户点击右上角分享的方法
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log(res.target);
    }
    return {
      title: this.courseInfo.course.title,
      // path: `/pages/course-detail/index?id=${this.id}`,
      imageUrl: this.courseInfo.course.cover_image_url
    };
  },
  methods: {
    // 获取课程详情数据
    async getCourseInfoData() {
      let res = await request({
        url: `course/${this.id}`
      });
      // 当请求成功后
      if (res.data.status === 0) {
        // 保存课程详情数据
        this.courseInfo = res.data.message;
        this.menu[2] = `评价(${res.data.message.commentTotal})`;
      }
    },
    // 播放视频
    playVideo() {
      this.isPlaying = true;
    },
    // 切换选中的索引
    toggleSelect(index) {
      this.currentIndex = index;
    },
    // 关注与取消关注
    async followOrUnfollow(lecturer) {
      switch (lecturer.is_follow) {
        case 1: {
          //关注状态，调用接口，取消关注
          let res = await request({
            url: "lecturer/unfollow",
            method: "POST",
            data: {
              lecturer_id: lecturer.id
            }
          });
          if (res.data.status === 0) {
            // 成功提示
            uni.showToast({
              title: res.data.message,
              duration: 500
            });
            // 状态设置为取消关注
            lecturer.is_follow = 0;
          }
          break;
        }
        case 0: {
          //未关注状态，调用接口，关注
          let res = await request({
            url: "lecturer/follow",
            method: "POST",
            data: {
              lecturer_id: lecturer.id
            }
          });
          if (res.data.status === 0) {
            // 成功提示
            uni.showToast({
              title: res.data.message,
              duration: 500
            });
            // 状态设置为关注
            lecturer.is_follow = 1;
          }
          break;
        }
      }
    },
    // 评论的点赞与取消点赞
    async likeOrUnlike(item) {
      switch (item.is_like) {
        case 1: {
          //之前为未点赞状态，发送请求，点赞
          let res = await request({
            url: "comment/like",
            method: "POST",
            data: {
              comment_id: item.course_id,
              is_like: 2
            }
          });
          if (res.data.status === 0) {
            // 点赞成功
            uni.showToast({
              title: '点赞成功',
              duration: 500
            });
            // 设置为已点赞状态
            item.is_like = 2;
          }
          break;
        }
        case 2: {
          //之前为已点赞状态，发送请求，取消点赞
          let res = await request({
            url: "comment/like",
            method: "POST",
            data: {
              comment_id: item.course_id,
              is_like: 1
            }
          });
          if (res.data.status === 0) {
            // 取消点赞成功
            uni.showToast({
              title: '取消点赞成功',
              duration: 500
            });
            // 设置为未点赞状态
            item.is_like = 1;
          }
          break;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.course-detail-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 750rpx;
      height: 434rpx;
    }
    position: relative;
    .play {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      image {
        width: 164rpx;
        height: 164rpx;
      }
      text {
        margin-top: 10rpx;
        color: #e9e9e9;
        font-size: 30rpx;
      }
    }
  }
  .course_video {
    width: 750rpx;
    height: 434rpx;
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: 0rpx;
    border-radius: 16px 16px 0px 0px;
    left: 0;
    right: 0;
    height: 452rpx;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    .title-price {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text:nth-child(1) {
        font-size: 24px;
        color: #343434;
        font-weight: Bold;
      }
      text:nth-child(2) {
        font-size: 22px;
        color: #ee3939;
      }
    }
    .introduce {
      color: #818181;
      font-size: 12px;
      margin-top: 100rpx;
    }
    .star {
      display: flex;
      margin-top: 20rpx;
      text {
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 20rpx;
        font-size: 12px;
        color: #fe8e38;
      }
    }
    .study-share {
      margin-top: 42rpx;
      margin-bottom: 52rpx;
      image:nth-child(1) {
        width: 568rpx;
        height: 92rpx;
      }
      .share-button {
        border: none;
        width: 92rpx;
        height: 92rpx;
        background-color: #fff;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image: url(../../static/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 34rpx 34rpx;
        background-position: 30rpx 30rpx;
      }
    }
  }
  .catalog {
    margin-top: 520rpx;
    // position: absolute;
    z-index: 5;
    width: 750rpx;
    // height: 582rpx;
    background-color: #ffffff;
    .head {
      height: 120rpx;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      text {
        text-align: center;
        color: #a8a8a8;
        font-size: 14px;
        height: 120rpx;
        line-height: 120rpx;
        flex: 1;
        position: relative;
      }
      .active {
        color: #333333;
        font-weight: bold;
        &::after {
          content: "";
          position: absolute;
          left: 88rpx;
          bottom: 0px;
          width: 74rpx;
          height: 3px;
          background-color: #ff8e43;
        }
      }
    }
    .catelog-container {
      padding: 30rpx;
      height: 582rpx;
      text {
        background-color: #ffffff;
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        display: block;
      }
    }
    .lecturer-container {
      padding: 30rpx;
      .info {
        height: 200rpx;
        display: flex;
        align-items: center;
        image {
          margin-left: 12rpx;
          width: 120rpx;
          height: 120rpx;
        }
        .name-follow {
          margin-left: 30rpx;
          display: flex;
          flex-direction: column;
          flex: 1;
          text:nth-child(1) {
            font-size: 34rpx;
            color: #333333;
          }
          text:nth-child(2) {
            font-size: 28rpx;
            margin-top: 15rpx;
            color: #a8a8a8;
          }
        }
        .unfollow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #a8a8a8;
          font-size: 28rpx;
        }
        .follow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #fff;
          background-color: #a8a8a8;
          font-size: 28rpx;
        }
      }
      .introduce {
        background-color: #ffffff;
        text {
          margin-left: 12rpx;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(168, 168, 168, 1);
          opacity: 1;
        }
      }
    }
    .comment-item {
      background-color: #ffffff;
      padding: 30rpx;
      height: 180rpx;
      border-bottom: 2px solid #f1f1f1;
      .info {
        height: 120rpx;
        display: flex;
        align-items: center;
        image {
          margin-left: 6rpx;
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
        .nickname-content {
          flex: 1;
          margin-left: 30rpx;
          .nickname {
            color: #333333;
            font-size: 30rpx;
            font-weight: bold;
            align-items: center;
            display: flex;
            view {
              height: 100%;
              display: inline-block;
            }
          }
          view:nth-child(2) {
            margin-top: 16rpx;
            color: #a8a8a8;
            font-size: 12px;
          }
        }
        .time {
          color: #a8a8a8;
          font-size: 11px;
        }
      }
    }
    .star {
      image {
        margin-top: 30rpx;
        width: 44rpx;
        height: 44rpx;
        float: right;
        margin-right: 20rpx;
      }
      image:nth-child(0) {
        margin-right: 20rpx;
      }
    }
  }
}
</style>