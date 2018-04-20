<script>
export default {
  name: 'progress-bar',

  props: {
    duration: {
      type: Number,
      default: 3000,
    },
  },

  data() {
    return {
      progress: 0,
    };
  },

  methods: {
    start() {
      this.progress = 0;
      this.update();
    },

    update() {
      if (this.progress === 100) {
        return;
      }

      this.progress = Math.min(100, this.progress + 5);

      setTimeout(() => {

        this.update();
      }, this.frameDuration);
    },

    finish() {
      this.progress = 100;
    }
  },

  computed: {
    frameDuration() {
      return this.duration / 20;
    }
  }
}
</script>

<template>
  <progress max="100" :value="progress" min="0" :class="{'done': progress === 100}"></progress>
</template>

<style lang="scss" scoped>
  progress[value] {
    appearance: none;
    width: 200px;
    height: 4px;

    &::-webkit-progress-bar {
      background-color: config('colors.black');
    }

    &::-webkit-progress-value {
      background-color: config('colors.blue');
      will-change: width;
      transition: width 400ms linear;
    }
  }
</style>
