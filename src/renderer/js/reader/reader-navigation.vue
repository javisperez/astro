<script>
import readerNavigationThumbnails from './reader-navigation-thumbnails.vue';

export default {
  name: 'reader-navigation',

  components: {
    readerNavigationThumbnails,
  },

  props: {
    active: {
      type: Array,
      required: true,
      default() {
        return [1];
      },
    },
    pages: {
      type: Array,
      required: true,
    }
  },

  data() {
    return {
      page: this.active[0],
      isThumbnailExpanded: false,
      isSplitMode: false,
    };
  },

  methods: {
    nextPage() {
      this.page = Math.min(this.page + 1, this.total);
      this.$emit('navigate', this.page);
    },

    previousPage() {
      this.page = Math.max(1, this.page - 1);
      this.$emit('navigate', this.page);
    },

    toggleSplitMode() {
      this.isSplitMode = !this.isSplitMode;
    }
  },

  computed: {
    index() {
      return Math.max(0, this.active[0] - 1);
    },

    activePages() {
      return this.active.join(' - ');
    },

    total() {
      return this.pages.length;
    },
  }
}
</script>

<template>
<div class="reader-navigation" :class="{ expanded: isThumbnailExpanded }">
  <div class="pages-info-bar">
    <!-- Previous page -->
    <button class="tool" style="height: 24px;" title="Previous page" @click="previousPage()">
      <fi-chevron-left></fi-chevron-left>
    </button>

    <!-- Current page / Number of pages -->
    <span class="tool text-sm page-number" title="Page number">
      <span>{{ activePages }}</span> <span class="text-grey-darker">/ {{ total }}</span>
    </span>

    <!-- Next page -->
    <button class="tool" style="height: 24px;" title="Next page" @click="nextPage()">
      <fi-chevron-right></fi-chevron-right>
    </button>

    <!-- Toogle Thumbnails -->
    <button class="tool" style="height: 24px;" title="More options"
      @click="isThumbnailExpanded = !isThumbnailExpanded">
      <fi :icon="!isThumbnailExpanded ? 'chevron-up' : 'chevron-down'"></fi>
    </button>
  </div>

  <!-- Navigation thumbnails -->
  <transition name="slide-up">
    <reader-navigation-thumbnails :active="active" :pages="pages" v-show="isThumbnailExpanded">
      <!-- Close the thumbnails -->
      <button class="tool text-grey-dark hover:text-grey" @click="isThumbnailExpanded = false">
        <fi-x></fi-x>
      </button>

      <!-- Split mode -->
      <button class="tool text-grey-dark hover:text-grey" title="Split mode"
        @click="toggleSplitMode" :class="{active: isSplitMode}">
        <fi-book-open></fi-book-open>
      </button>
    </reader-navigation-thumbnails>
  </transition>
</div>
</template>
