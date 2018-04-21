<script>
import progressBar from 'support/progress-bar.vue';
import { setInterval } from 'timers';

export default {
  name: 'astro-loading-screen',

  components: {
    progressBar,
  },

  props: {
    done: Boolean,
    error: Boolean
  },

  data() {
    return {
      counter: 0,
    }
  },

  mounted() {
    this.$progress.start();
  },

  computed: {
    $progress() {
      return this.$refs.progressBar;
    }
  },

  watch: {
    done(value) {
      if (value) {
        this.$progress.finish();
      }
    },

    error(value) {
      if (value) {
        this.$progress.finish();
      }
    }
  }
}
</script>

<template>
<div class="loading-screen" :class="{'error': error}">
  <div class="logo-bg"></div>

  <progress-bar ref="progressBar" :duration="10000"></progress-bar>

  <div class="error-message text-white font-lg mt-8" v-if="error">
    Oh snaps! that doesn't seems like a valid comic file.
  </div>
</div>
</template>
