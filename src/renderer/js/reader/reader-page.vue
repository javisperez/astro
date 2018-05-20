<script>
import dragscroll from 'dragscroll';

export default {
  name: 'reader-page',

  props: {
    data: Object,
    modifiable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    }
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
      if (!this.modifiable) {
        return '';
      }

      const keys = ['filter', 'transform', 'transformOrigin'];

      let styles = {};

      let output = '';

      keys.forEach(key => { styles[key] = {}; });

      if (this.data.modifiers.brightness !== 100) {
        styles.filter.brightness = `${Math.min(200, Math.max(0, this.data.modifiers.brightness))}%`;
      }

      if (this.data.modifiers.zoom !== 1) {
        styles.transform.scale = this.data.modifiers.zoom;

        if (this.data.modifiers.zoom < 1) {
          styles.transformOrigin = '50% 0';
        }
      }

      // Parse the styles
      keys.forEach(key => {
        const properties = styles[key];

        output += `${key}: `;

        if (typeof properties === 'object') {
          Object.keys(properties).forEach((property) => {
            output += `${property}(${properties[property]})`;
          });
        } else {
          output += properties;
        }

        output += '; ';
      });

      if (this.$el) {
        const img = this.$el.querySelector('img');
        // Force the browser to "redraw" the scrollbars
        // After the animation end
        img.addEventListener('transitionend', _ => {
          if (this.data.modifiers.zoom >= 1) {
            img.style.transformOrigin = '0 0';
          }
          this.$el.style.display = 'none';
          this.$el.offsetHeight;
          this.$el.style.display = 'block';
        }, false);
      }

      return output;
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
    }
  }
}
</script>

<template>
	<div class="reader-page" ref="page" :class="{ visible: isLoaded, dragscroll: draggable }">
    <img :style="style" :src="src">
  </div>
</template>
