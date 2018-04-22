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

  mounted() {
    this.$progress.start();
  },

  updated() {
    if (this.error) {
      return;
    }

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
        this.$progress.cancel();
      }
    }
  }
}
</script>

<template>
<div class="loading-screen" :class="{'error': error}">
  <div class="logo-bg"></div>

  <progress-bar ref="progressBar" :duration="6000" v-show="!error"></progress-bar>

  <div class="error-message text-error font-lg" v-show="error">
    <fi-x size="62"></fi-x>

    <div>
      Oh snaps! that doesn't seems like a valid comic file.
    </div>
  </div>
</div>
</template>
