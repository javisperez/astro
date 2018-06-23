<script>
import fs from 'fs';
import { db } from 'support';
import dragscroll from 'dragscroll';
import { ipcRenderer } from 'electron';
import readerPage from './reader-page.vue';
import readerToolbar from './reader-toolbar.vue';
import activeModifiers from './active-modifiers.vue';
import readerNavigation from './reader-navigation.vue';
import readerSettingsModal from './reader-settings-modal.vue';

export default {
  name: 'reader',

  components: {
    readerPage,
    readerToolbar,
    activeModifiers,
    readerNavigation,
    readerSettingsModal,
  },

  props: {
    files: Array,
    metadata: Object,
  },

  created() {
    this.getSettings();
  },

  data() {
    return {
      pages: [],
      settings: {},
      currentIndex: 0,
      currentTool: null,
      isDragging: false,
      isModifiable: true,
      currentMode: 'default',
      isTransitioning: false,
      areSettingsOpen: false,
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
    openSettings() {
      this.areSettingsOpen = true;
    },

    getSettings() {
      db.settings.where('comic_id').equals(this.metadata.key).first()
        .then(settings => {
          this.settings = settings;
        });
    },

    closeSettings() {
      this.areSettingsOpen = false;
      this.getSettings();
    },

    goToPage(page) {
      this.currentIndex = page - 1;
      this.saveHistory();
    },

    toggleReadingMode(mode = 'default') {
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

    toggleModifiers() {
      this.isModifiable = !this.isModifiable;
    },

    applyModifiers(modifiers) {
      this.currentPage.modifiers = { ...modifiers };
    },
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
            key: this.metadata.key,
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
    },

    visiblePages() {
      let pages = [this.currentIndex + 1];

      if (this.currentMode === 'split') {
        pages.push(this.currentIndex + 2);
      }

      pages = pages.map(p => Math.min(p, this.pages.length));

      return pages;
    }
  },
}
</script>

<template>
  <div class="reader">
    <!-- toolbar -->
    <reader-toolbar v-model="currentTool" :disabled="currentMode === 'split' ? ['zoom'] : []"
      v-bind="currentPage.modifiers" @modified="applyModifiers"
      @settings:open="openSettings" @settings:close="closeSettings"></reader-toolbar>

    <!-- The pages -->
    <div class="pages-container" :class="[
        currentTool ? `tool-${currentTool}`: null,
        isDragging ? 'dragging' : null,
      ]">

      <!-- Bottom navigation -->
      <reader-navigation @navigate="goToPage"
        :total-pages="pages.length" :current-page="currentIndex + 1"></reader-navigation>

      <!-- Pages of the comic -->
      <div class="pages" ref="pages" :class="[
          currentMode,
          (currentMode === 'split' && isDraggable) ? 'dragscroll' : null
        ]" @mousedown="isDragging = true" @mouseup="isDragging = false">
        <!-- Current applied changes -->
        <active-modifiers v-bind="currentPage.modifiers" @toggle="toggleModifiers"></active-modifiers>

        <!-- Pages -->
        <reader-page :ref="'page'+$index" v-for="(page, $index) in pages" :key="$index"
          v-if="isVisible($index)" :data="page" :settings="settings"
          :modifiable="isModifiable" :draggable="isDraggable"></reader-page>
      </div>

      <!-- Settings modal -->
      <transition name="fade">
        <reader-settings-modal v-if="areSettingsOpen" :preview="currentPage" @close="closeSettings"></reader-settings-modal>
      </transition>
    </div>
  </div>
</template>
