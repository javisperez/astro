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
    total: {
      type: Number,
      required: true,
      default: 1,
    }
  },

  data() {
    return {
      page: this.active[0],
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
  },

  computed: {
    index() {
      return Math.max(0, this.active[0] - 1);
    },

    activePages() {
      return this.active.join(' - ');
    }
  }
}
</script>

<template>
<div class="reader-navigation">
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
    <button class="tool" style="height: 24px;" title="More options" @click="toggleThumbnails()">
      <fi icon="chevron-up"></fi>
      <!-- <fi-chevron-down v-if="isThumbnailExpanded"></fi-chevron-down> -->
    </button>
  </div>

  <!-- Navigation thumbnails -->
  <!-- <reader-navigation-thumbnails></reader-navigation-thumbnails> -->
</div>
</template>
