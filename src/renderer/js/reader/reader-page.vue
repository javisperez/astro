<script>
import dragscroll from 'dragscroll';

export default {
  name: 'reader-page',

  props: {
    data: { type: Object },
    modifiable: { type: Boolean, default: true, },
    draggable: { type: Boolean, default: true, },
    settings: {
      type: Object,
      default: {
        brightness: 100,
        contrast: 100,
        flipped: false
      }
    },
  },

  data() {
    return {
      isLoaded: false,
      src: null,
    };
  },

  beforeMount() {
    const img = new Image();
    img.onload = () => { this.src = img.src };
    img.src = this.data.file;
  },

  mounted() {
    const img = this.$el.querySelector('img');
    img.onload = () => { this.isLoaded = true; };
  },

  methods: {
    emit(what, $event) {
      const $el = this.$el;
      this.$emit(what, { $event, $el });
    },

  },

  computed: {
    style() {
      const style = {
        filter: `
          brightness(${this.settings.brightness / 100})
          contrast(${this.settings.contrast / 100})
        `,
      };

      return style;
    }
  },

  watch: {
    draggable: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          dragscroll.reset();
        });
      }
    },
  }
}
</script>

<template>
	<div class="reader-page" ref="page" :class="{ visible: isLoaded, dragscroll: draggable }">
    <img :style="style" :src="src">
  </div>
</template>
