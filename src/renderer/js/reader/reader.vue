<script>
import fs from 'fs';
import { db } from 'support';
import readerPage from './reader-page.vue';
import readerToolbar from './reader-toolbar.vue';
import activeModifiers from './active-modifiers.vue';
import dragscroll from 'dragscroll';
import { ipcRenderer } from 'electron';

export default {
  name: 'reader',

  components: {
    readerPage,
    readerToolbar,
    activeModifiers,
  },

  props: {
    files: Array,
    metadata: Object,
  },

  data() {
    return {
      pages: [],
      currentIndex: 0,
      currentMode: 'default',
      currentTool: null,
      isTransitioning: false,
      isThumbnailExpanded: false,
      isModifiable: true,
      isDragging: false,
    };
  },

  beforeMount() {
    // Show the tools menu
    ipcRenderer.send('menu:show', 'tools');
    ipcRenderer.send('menu:enable', 'add-to-bookmark');
    ipcRenderer.send('menu:enable', 'close-file');
  },

  beforeDestroy() {
    ipcRenderer.send('menu:hide', 'tools');
  },

  methods: {
    nextImage() {
      this.currentIndex = Math.min(this.files.length - 1, this.currentIndex + 1);
      this.saveHistory();
    },

    previousImage() {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
      this.saveHistory();
    },

    toggleCurrentMode(mode = 'default') {
      this.currentTool = null;

      if (this.isTransitioning) {
        return;
      }

      this.isTransitioning = true;

      if (this.currentMode === mode) {
        this.currentMode = 'default';
      } else {
        this.currentMode = mode;
      }

      // Save it
      this.saveHistory();

      // And now flip it!
      const page = this.$refs[`page${this.currentIndex}`][0].$el;
      const first = page.getBoundingClientRect();

      this.$nextTick(() => {
        const last = page.getBoundingClientRect();

        // Animate the transition
        this.flip(
          page,
          `scale(${first.width / last.width})`,
          `scale(1)`,
          () => {
              this.isTransitioning = false;
          },
          400
        );
      });
    },

    toggleThumbnails() {
      this.isThumbnailExpanded = !this.isThumbnailExpanded;
    },

    isVisible(index) {
      if (index === this.currentIndex) {
        return true;
      }

      if (this.currentMode === 'split' && index === this.currentIndex + 1) {
        return true;
      }

      return false;
    },

    flip(element, from, to, callback, duration = 400) {
      element.style.transformOrigin = '0 0';
      element.style.transform = from;

      setTimeout(() => {
        element.style.transition = `transform ${duration / 1000}s`;
        element.style.transform = to;
      });

      setTimeout(() => {
        element.style.transform = 'none';
        element.style.transition = 'none';

        if (callback) {
          callback();
        }
      }, duration + 50);
    },

    saveHistory() {
      localStorage.setItem(`${this.metadata.key}-current-index`, this.currentIndex);
      localStorage.setItem(`${this.metadata.key}-current-mode`, this.currentMode);
    },

    thumbnailInRange(index) {
      let from = this.currentIndex - 5;
      let to = this.currentIndex + 5;

      if (this.currentMode === 'split') {
        from += 1;
      }

      return (index > from && index < to);
    },

    toggleModifiers() {
      this.isModifiable = !this.isModifiable;
    },

    applyModifiers(modifiers) {
      this.currentPage.modifiers = { ...modifiers };
    }
  },

  watch: {
    files: {
      immediate: true,
      deep: true,
      handler(value, old) {
        const pages = [];

        this.currentIndex = Number(localStorage.getItem(`${this.metadata.key}-current-index`)) || 0,
        this.currentMode = localStorage.getItem(`${this.metadata.key}-current-mode`) || 'default',

        value.forEach(file => {
          pages.push({
            file,
            modifiers: {
              brightness: 100,
              zoom: 1,
            },
          });
        });

        this.pages = pages;
      }
    },

    currentMode: {
      immediate: true,
      handler(value) {
        this.$nextTick(() => {
          dragscroll.reset();
        });
      }
    },
  },

  computed: {
    currentPage() {
      return this.pages[this.currentIndex];
    },

    isDraggable() {
      return this.currentTool === 'drag';
    }
  },
}
</script>

<template>
  <div class="reader">
    <!-- toolbar -->
    <reader-toolbar v-model="currentTool" v-bind="currentPage.modifiers" @modified="applyModifiers"></reader-toolbar>

    <!-- The pages -->
    <div class="pages-container" :class="[
        currentTool ? `tool-${currentTool}`: null,
        isDragging ? 'dragging' : null,
      ]" @mousedown="isDragging = true" @mouseup="isDragging = false">
      <div class="pages-info-bar" :class="{ expanded: isThumbnailExpanded }">
        <!-- Previous -->
        <button class="tool" style="height: 24px;" title="Previous page" @click="previousImage()">
          <fi-chevron-left></fi-chevron-left>
        </button>

        <!-- Current page / Number of pages -->
        <span class="tool text-sm page-number" title="Page number">
          {{ currentIndex + 1 }} <span v-show="currentMode === 'split' && currentIndex < files.length - 1"> - {{ currentIndex + 2 }}</span> <span class="text-grey-darker">/ {{ files.length }}</span>
        </span>

        <!-- Next -->
        <button class="tool" style="height: 24px;" title="Next page" @click="nextImage()">
          <fi-chevron-right></fi-chevron-right>
        </button>

        <button class="tool" style="height: 24px;" title="More options" @click="toggleThumbnails()">
          <fi-chevron-up v-if="!isThumbnailExpanded"></fi-chevron-up>
          <fi-chevron-down v-if="isThumbnailExpanded"></fi-chevron-down>
        </button>
      </div>

      <!-- Thumbnails -->
      <div class="thumbnails-list whitespace-no-wrap flex" :class="{expanded: isThumbnailExpanded}">
        <ul class="list-reset overflow-hidden">
          <li class="inline-block px-1" v-for="(image, $index) in files" :key="$index"
            v-if="thumbnailInRange($index)"
            :class="{
              active: (currentIndex === $index) || (currentIndex + 1 === $index && currentMode === 'split')
            }">
            <img :src="image" height="60" />
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

      <div class="pages" ref="pages" :class="[
        currentMode,
        (currentMode === 'split' && isDraggable) ? 'dragscroll' : null
      ]">
        <!-- Current applied changes -->
        <active-modifiers v-bind="currentPage.modifiers" @toggle="toggleModifiers"></active-modifiers>

        <!-- Pages -->
        <reader-page :ref="'page'+$index" v-for="(page, $index) in pages" :key="$index"
          v-if="isVisible($index)" :data="page"
          :modifiable="isModifiable" :draggable="isDraggable"></reader-page>
      </div>
    </div>
  </div>
</template>
