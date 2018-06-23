<script>
export default {
  name: 'reader-navigation',

  props: {
    totalPages: {
      type: Number,
    },

    currentPage: {
      type: Number,
    },
  },

  data() {
    return {
      page: this.currentPage,
    };
  },

  methods: {
    goToPage(page) {
      this.page = page;
      this.$emit('navigate', this.page);
    },

    nextPage() {
      this.goToPage(Math.min(this.currentPage + 1, this.totalPages));
    },

    previousPage() {
      this.goToPage(Math.max(1, this.currentPage - 1));
    },
  },
}
</script>

<template>
<div class="reader-navigation">
  <div class="pages-info-bar">
    <!-- First page -->
    <button class="tool" style="height: 24px;" title="First page" @click="goToPage(1)"
      :class="{'opacity-50 cursor-deny': page === 1}">
      <fi-chevrons-left></fi-chevrons-left>
    </button>

    <!-- Previous page -->
    <button class="tool" style="height: 24px;" title="Previous page" @click="previousPage()"
      :class="{'opacity-50 cursor-deny': page === 1}">
      <fi-chevron-left></fi-chevron-left>
    </button>

    <!-- Current page / Number of pages -->
    <span class="tool text-sm page-number" title="Page number">
      <span>{{ currentPage }}</span> <span class="text-grey-darker">/ {{ totalPages }}</span>
    </span>

    <!-- Next page -->
    <button class="tool" style="height: 24px;" title="Next page" @click="nextPage()"
      :class="{'opacity-50 cursor-deny': page === totalPages}">
      <fi-chevron-right></fi-chevron-right>
    </button>

    <!-- Last page -->
    <button class="tool" style="height: 24px;" title="Last page" @click="goToPage(totalPages)"
      :class="{'opacity-50 cursor-deny': page === totalPages}">
      <fi-chevrons-right></fi-chevrons-right>
    </button>
  </div>
</div>
</template>
