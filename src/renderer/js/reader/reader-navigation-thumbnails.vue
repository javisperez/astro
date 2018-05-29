<script>
export default {
  name: 'reader-navigation-thumbanils',

  props: {
    active: { type: Array, required: true, default() { return []; } },
    pages: { type: Array },
  },

  data() {
    return {
      from: 0,
    }
  },

  computed: {
    thumbnails() {
      const h = Math.floor((9 - this.active.length) / 2);
      const to = Math.min(this.pages.length, this.active[this.active.length - 1] + h);

      this.from = Math.max(0, this.active[0] - (h + 1));

      const sliced = this.pages.slice(this.from, to);

      // Cache the thumbnails
      sliced.forEach((s) => {
        const i = new Image();
        i.src = s.file;
      });

      return sliced;
    },
  }
}
</script>

<template>
<div class="reader-navigation-thumbnails whitespace-no-wrap flex">
  <ul class="list-reset">
    <li class="inline-block px-1" v-for="(page, $index) in thumbnails" :key="$index"
      :class="{ active: active.includes((from + 1) + $index) }">
      <img :src="page.file" height="60" />
    </li>
  </ul>

  <!-- Pass any additional icon as slot -->
  <div class="reading-modes flex flex-col justify-between ml-2">
    <slot></slot>
  </div>
</div>
</template>
