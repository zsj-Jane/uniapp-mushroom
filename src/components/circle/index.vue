<template>
  <view class="mp-circle-container">
    <canvas class="mp-circle" :style="{width:width+'px',height:height+'px'}" :canvas-id="canvasId"></canvas>
  </view>
</template>

<script>
export default {
  props: {
    canvasId: Number,
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    backgroundColor: {
      type: String,
      default: "#f3f3f3"
    },
    foregroundColor: {
      type: String,
      default: "#b5d574"
    },
    lineWidth: {
      type: Number,
      default: 5
    },
    progress: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      myforegroundColor: this.foregroundColor
    };
  },
  mounted() {
    this.drawProgress();
  },
  methods: {
    drawProgress() {
      // 0、处理不同进度，显示的颜色
      if (this.progress <= 30) {
        this.myforegroundColor = "#ff0000";
      } else if (this.progress > 30 && this.progress <= 70) {
        this.myforegroundColor = "#FF783B";
      } else {
        this.myforegroundColor = "#B4D66E";
      }
      
      // 1、拿到绘图上下文
      const ctx = uni.createCanvasContext(this.canvasId, this);

      // 2、画背景图
      ctx.beginPath();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.backgroundColor;
      ctx.arc(
        this.width / 2,
        this.height / 2,
        this.width / 2 - this.lineWidth,
        0,
        2 * Math.PI
      );
      ctx.stroke();

      // 3、画进度
      ctx.beginPath();
      ctx.lineWidth = this.lineWidth;
      ctx.setLineCap("round");
      ctx.strokeStyle = this.myforegroundColor;
      const endAngle = (this.progress / 100) * 2 * Math.PI - Math.PI * 0.5;
      ctx.arc(
        this.width / 2,
        this.height / 2,
        this.width / 2 - this.lineWidth,
        -0.5 * Math.PI,
        endAngle
      );
      ctx.stroke();

      // 4、画文字
      ctx.beginPath();
      ctx.font = "12px Helvetica";
      ctx.fillStyle = this.myforegroundColor;
      if (this.progress >= 99) {
        ctx.fillText(
          this.progress + "%",
          this.width / 2 - 13,
          this.height / 2 + 6
        );
      } else {
        ctx.fillText(
          this.progress + "%",
          this.width / 2 - 10,
          this.height / 2 + 6
        );
      }
      // ctx.fill();

      // 5、绘制
      ctx.draw();
    }
  }
};
</script>

<style scoped>
.mp-circle-container {
  position: relative;
}
.mp-circle {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
</style>