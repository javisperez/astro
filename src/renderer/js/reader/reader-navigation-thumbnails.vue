<script>
export default {
  name: 'reader-navigation-thumbanils',

  props: {
    active: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },

    pages: {
      type: Array,
    }
  }
}
</script>

<template>
<div class="reader-navigation-thumbnails whitespace-no-wrap flex">
  <ul class="list-reset overflow-hidden">
    <li class="inline-block px-1" v-for="(page, $index) in pages" :key="$index"
      :class="{ active: active.includes($index + 1) }">
      <img :src="page.file" height="60" />
    </li>
  </ul>

  <!-- Pass any additional icon as slot -->
  <div class="reading-modes flex flex-col justify-between ml-2">
    <slot></slot>
  </div>
</div>
</template>
