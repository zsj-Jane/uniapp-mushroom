<template>
  <courseList :courses="courses"></courseList>
</template>

<script lang="ts">
import Vue from "vue";
import request from "../../utils/request";
import courseList from "../../components/course-list/index.vue";
export default Vue.extend({
  components: {
    courseList
  },
  data() {
    return {
      courses: []
    };
  },
  onLoad() {
    this.getCoursesData();
  },
  methods: {
    // 获取课程列表数据
    async getCoursesData() {
      let res: any = await request({ url: "course/list" });
      console.log(res.data);
      if (res.data.status === 0) {
        this.courses = res.data.message;
      }
    }
  }
});
</script>
