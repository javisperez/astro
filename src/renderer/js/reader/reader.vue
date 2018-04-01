<script>
import fs from 'fs';
import page from './page.vue';
import { ipcRenderer } from 'electron';

export default {
    name: 'reader',

    components: {
        page
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
            currentBrightness: 100,
        };
    },

    beforeMount() {
        // Show the tools menu
        ipcRenderer.send('menu:show', 'tools');
        ipcRenderer.send('menu:show', 'add-to-bookmark');
        ipcRenderer.send('menu:show', 'add-to-bookmark:separator');

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

        toggleTool(tool = null) {
            if (this.currentTool === tool) {
                this.currentTool = null;
            } else {
                this.currentTool = tool;
            }
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
            if (index > this.currentIndex - 5 && index < this.currentIndex + 5) {
                return true;
            }

            return false;
        },

        setBrightness(brightness = 100) {
            this.currentBrightness = Math.max(0, Math.min(200, brightness));

            this.pages.forEach(page => {
                page.brightness = this.currentBrightness;
            })
        },

        setZoom(delta = 0) {
            const currentPage = this.pages[this.currentIndex];
            const zoom = currentPage.zoom.level + delta;

            currentPage.zoom.level = Math.min(3, Math.max(0.5, zoom.toFixed(2)));
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
                        brightness: 100,
                        zoom: {
                            x: 0,
                            y: 0,
                            level: 1,
                        }
                    });
                });

                this.pages = pages;
            }
        },
    }
}
</script>

<template>
  <div class="reader">
    <!-- toolbar -->
    <div class="toolbar">
        <div class="tools">
            <!-- Move -->
            <button class="tool" :class="{'active': currentTool === 'drag'}" title="Drag"
                @click="toggleTool('drag')">
                <fi-move></fi-move>
            </button>

            <!-- Zoom in -->
            <button class="tool" title="Zoom In" @click="setZoom(0.2)">
                <fi-zoom-in></fi-zoom-in>
            </button>

            <!-- Zoom out -->
            <button class="tool" title="Zoom Out" @click="setZoom(-0.2)">
                <fi-zoom-out></fi-zoom-out>
            </button>

            <!-- Sunrise (brightness up) -->
            <button class="tool push-btn" title="Brightness up" @click="setBrightness(currentBrightness + 10)">
                <fi-sunrise></fi-sunrise>
            </button>

            <!-- Sunset (brightness down) -->
            <button class="tool push-btn" title="Brightness down" @click="setBrightness(currentBrightness - 10)">
                <fi-sunset></fi-sunset>
            </button>
        </div>
    </div>

    <!-- The pages -->
    <div class="pages-container">
        <div class="pages-info-bar" :class="{'expanded': isThumbnailExpanded}">
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
        <div class="thumbnails-list whitespace-no-wrap flex" :class="{'expanded': isThumbnailExpanded}">
            <ul class="list-reset overflow-x-hidden">
                <li class="inline-block px-1" v-for="(image, $index) in files" :key="$index"
                    v-if="thumbnailInRange($index)" :class="{
                        'active': (currentIndex === $index) || (currentIndex + 1 === $index && currentMode === 'split')
                    }">
                    <img :src="image" height="60" />
                </li>
            </ul>

            <div class="reading-modes flex flex-col justify-between ml-2">
                <!-- Split mode -->
                <button class="tool text-grey-dark hover:text-grey" title="Split mode" :class="{active: currentMode === 'split'}"
                    @click="toggleCurrentMode('split')">
                    <fi-book-open></fi-book-open>
                </button>
            </div>
        </div>

        <div class="pages" ref="pages" :class="currentMode">
            <page v-for="(page, $index) in pages" :ref="'page'+$index" :key="$index"
                v-if="isVisible($index)" :data="page"></page>
        </div>
    </div>
  </div>
</template>
