<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'reader-toolbar',

  props: {
    value: { required: true },
    zoom: { default: 1 },
    brightness: { default: 100 },
    disabled: { default: () => [] }
  },

  data() {
    return {
      modifiers: {
        zoom: this.zoom,
        brightness: this.brightness,
      },
    };
  },

  beforeMount() {
    // Listen for the tools menu click
    ipcRenderer.on('tools:tool', (e, tool) => {
      switch(tool) {
        case 'zoom-in':
          this.setZoom(0.2);
          break;

        case 'zoom-out':
          this.setZoom(-0.2);
          break;

        case 'brightness-up':
          this.setBrightness(this.currentBrightness + 10);
          break;

        case 'brightness-down':
          this.setBrightness(this.currentBrightness - 10);
          break;

        default:
          this.toggleTool(tool);
          break;
      }
    });
  },

  methods: {
    toggleTool(tool) {
      if (this.disabled.includes(tool)) {
        return;
      }
      this.$emit('input', this.value === tool ? null : tool);
    },

    setZoom(delta = 0.2) {
      if (this.disabled.includes('zoom')) {
        return;
      }
      this.modifiers.zoom += delta;
      this.$emit('modified', this.modifiers);
    },

    setBrightness(brightness = 100) {
      if (this.disabled.includes('zoom')) {
        return;
      }
      this.modifiers.brightness = Math.max(0, Math.min(200, brightness));
      this.$emit('modified', this.modifiers);
    },

    openSettings() {
      this.$emit('settings:open');
    },
  },

  watch: {
    zoom(value) {
      this.modifiers.zoom = value;
    },

    brightness(value) {
      this.modifiers.brightness = value;
    },

    modifiers: {
      immediate: true,
      deep: true,
      handler(modifiers, previous) {
        if (modifiers === previous) {
          return;
        }

        this.$emit('modified', modifiers);
      }
    }
  }
}
</script>

<template>
  <div class="reader-toolbar">
    <div class="tools">
      <!-- Move -->
      <button class="tool" title="Drag" @click="toggleTool('drag')"
        :class="{ active: value === 'drag', disabled: disabled.includes('drag') }">
        <fi-move></fi-move>
      </button>

      <!-- Zoom -->
      <button class="tool" title="Zoom In" @click="setZoom(0.2)"
        :class="{ applied: modifiers.zoom > 1, disabled: disabled.includes('zoom') }">
        <fi-zoom-in></fi-zoom-in>
      </button>

      <!-- Settings -->
      <button class="tool absolute pin-b" title="Settings" @click="openSettings">
        <fi-sliders></fi-sliders>
      </button>
    </div>
  </div>
</template>
