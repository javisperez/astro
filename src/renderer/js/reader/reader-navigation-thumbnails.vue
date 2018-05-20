<script>
export default {
  name: 'reader-navigation-thumbanils',

  props: {
    currentPage: {
      type: Number,
      required: true,
    },

    pages: {
      type: Array,
    }
  }
}
</script>

<template>
<div class="thumbnails-list whitespace-no-wrap flex" :class="{expanded: isThumbnailExpanded}">
  <ul class="list-reset overflow-hidden">
    <li class="inline-block px-1" v-for="(page, $index) in pages" :key="$index"
      v-if="thumbnailInRange($index)"
      :class="{
        active: (currentIndex === $index) || (currentIndex + 1 === $index && currentMode === 'split')
      }">
      <img :src="page" height="60" />
    </li>
  </ul>

  <div class="reading-modes flex flex-col justify-between ml-2">
    <!-- Close the thumbnails -->
    <button class="tool text-grey-dark hover:text-grey" @click="toggleThumbnails()">
      <fi-x></fi-x>
    </button>

    <!-- Split mode -->
    <button class="tool text-grey-dark hover:text-grey" title="Split mode"
      @click="toggleCurrentMode('split')"
      :class="{
        active: currentMode === 'split'
      }"
    >
      <fi-book-open></fi-book-open>
    </button>
  </div>
</div>
</template>
