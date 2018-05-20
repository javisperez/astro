<script>
export default {
  name: 'active-modifiers',

  props: ['zoom', 'brightness'],

  data() {
    return {
      isToggled: false,
    };
  },

  methods: {
    toggle() {
      this.isToggled = !this.isToggled;
      this.$emit('toggle', this.isToggled);
    },
  },

  computed: {
    isActive() {
      return this.zoom !== 1 || this.brightness !== 100;
    },
  },

  filters: {
    number(input, decimals = 2) {
      return input * 10 * decimals / (10 * decimals);
    }
  }
}
</script>

<template>
  <transition name="slide-right">
    <div class="active-modifiers" v-if="isActive" :class="{'toggled': isToggled}">

      <!-- Zoom level -->
      <span class="zoom-level mr-2 text-sienna flex items-center"
        :title="`Current zoom is ${zoom * 100}%`"
        v-show="zoom !== 1 && !isToggled">
        <fi-zoom-in size="12" v-show="zoom > 1"></fi-zoom-in>
        <fi-zoom-out size="12" v-show="zoom < 1"></fi-zoom-out>
        {{ (zoom * 100) }}%
      </span>

      <!-- Brightness level -->
      <span class="brightness-level mr-2 text-yellow flex items-center"
        :title="`Current brightness is ${brightness}%`"
        v-show="brightness !== 100 && !isToggled">
        <fi-sunrise size="12" v-show="brightness > 100"></fi-sunrise>
        <fi-sunset size="12" v-show="brightness < 100"></fi-sunset>
        {{ brightness }}%
      </span>

      <!-- Disable all the effects -->
      <span class="disable-modifiers cursor-pointer" @click="toggle()">
        <fi-power size="12"></fi-power>
      </span>
    </div>
  </transition>
</template>
