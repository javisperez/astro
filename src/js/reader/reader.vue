<script>
import fs from 'fs';
import page from './page.vue';

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
            currentIndex: Number(localStorage.getItem(`${this.metadata.key}-current-index`)) || 0,
            currentMode: localStorage.getItem(`${this.metadata.key}-current-mode`) || 'default',
            currentTool: null,
            isTransitioning: false,
        };
    },

    mounted() {
        this.$refs.pages.addEventListener('scroll', () => {
            this.setCurrentPageFromScroll();
        })
    },

    methods: {
        open() {
            this.$emit('open');
        },

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

            // if (tool.indexOf('readingMode') === 0) {
            //     if (this.isTransitioning) {
            //         return;
            //     }

            //     this.isTransitioning = true;

            //     // Save it
            //     this.saveHistory();

            //     // And now flip it!
            //     const page = this.$refs[`page${this.currentIndex}`][0].$el;
            //     const first = page.getBoundingClientRect();

            //     this.$nextTick(() => {
            //         const last = page.getBoundingClientRect();

            //         // Animate the transition
            //         this.flip(
            //             page,
            //             `scale(${first.width / last.width})`,
            //             `scale(1)`,
            //             () => {
            //                 this.isTransitioning = false;
            //             },
            //             400
            //         );
            //     });
            // }
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

        setCurrentPageFromScroll() {
            if (this.currentMode !== 'continuous') {
                return;
            }

            this.$pages.forEach((page, i) => {
                if (!this.isOnViewport(page)) {
                    return;
                }

                this.currentIndex = i;
            });
        },

        isOnViewport(el) {
            const rect = el.getBoundingClientRect();

            return rect.top > 0 && rect.top <= (window.innerHeight / 2);
        },

        isVisible(index) {
            if (this.currentMode === 'continuous') {
                return true;
            }

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
        }
    },

    watch: {
        currentPage(value) {
            this.currentIndex = value;
        },

        currentMode(value, previous) {
            if (value === 'continuous') {
                const pages = this.$pages;
                let offsetScroll = 0; // toolbar height

                if (previous === 'default') {
                    offsetScroll += pages[this.currentIndex].scrollTop;
                }

                this.$nextTick(() => {
                    const targetScroll = pages[this.currentIndex].offsetTop;
                    this.$refs.pages.scrollTop = targetScroll + offsetScroll;
                });
            }
        }
    },

    computed: {
        progress() {
            return (this.currentIndex + 1) / this.files.length;
        },

        $pages() {
            return this.$refs.pages.querySelectorAll('.reader-page');
        }
    }

}
</script>

<template>
  <div class="reader">
    <!-- toolbar -->
    <div class="toolbar">
        <div class="tools">
            <!-- Open a file -->
            <button class="tool" @click="open()" title="Open a file">
                <fi-folder></fi-folder>
            </button>

            <!-- Move -->
            <button class="tool" :class="{'active': currentTool === 'move'}" title="Move"
                @click="toggleTool('move')">
                <fi-move></fi-move>
            </button>

            <!-- Zoom in -->
            <button class="tool" :class="{'active': currentTool === 'zoomIn'}" title="Zoom In"
                @click="toggleTool('zoomIn')">
                <fi-zoom-in></fi-zoom-in>
            </button>

            <!-- Zoom out -->
            <button class="tool" :class="{'active': currentTool === 'zoomOut'}" title="Zoom Out"
                @click="toggleTool('zoomOut')">
                <fi-zoom-out></fi-zoom-out>
            </button>

            <!-- Continuous mode -->
            <button class="tool mt-auto" title="Continuous mode" :class="{active: currentMode === 'continuous'}"
                @click="toggleCurrentMode('continuous')">
                <fi-film></fi-film>
            </button>

            <!-- Split mode -->
            <button class="tool" title="Split mode" :class="{active: currentMode === 'split'}"
                @click="toggleCurrentMode('split')">
                <fi-book-open></fi-book-open>
            </button>

            <!-- Divider -->
            <hr>

            <!-- Pagination -->
            <div class="page-number">
                {{ currentIndex + 1 }}<br>
                <span class="text-grey-darker text-sm">/ {{ files.length }}</span>
            </div>
        </div>

        <!-- Current progress -->
        <!-- <div class="progress-bar">
            <div class="bg-blue" :style="`transform: scaleX(${progress})`"></div>
        </div> -->
    </div>

    <!-- The pages -->
    <div class="pages-container">
        <div class="pages-info-bar">
            <!-- Previous -->
            <button class="tool" title="Previous page" @click="previousImage()">
                <fi-chevron-left></fi-chevron-left>
            </button>

            <!-- Next -->
            <button class="tool" title="Next page" @click="nextImage()">
                <fi-chevron-right></fi-chevron-right>
            </button>

            <!-- Comic name -->
            <span class="title text-sm">
                {{ metadata.title || ''}}
            </span>
        </div>

        <div class="pages" ref="pages" :class="[currentMode]">
            <page v-for="(image, $index) in files" :ref="'page'+$index" :key="$index"
                v-show="isVisible($index)" :path="image"></page>
        </div>
    </div>
  </div>
</template>
