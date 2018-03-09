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
        metadata: Object
    },

    data() {
        return {
            currentIndex: 0,
            readingMode: 'default'
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
        },

        previousImage() {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
        },

        toggleReadingMode(mode = 'default') {
            if (this.readingMode === mode) {
                this.readingMode = 'default';
            } else {
                this.readingMode = mode;
            }

            // now flip it!
            const page = this.$refs[`page${this.currentIndex}`][0].$el;
            const first = page.getBoundingClientRect();

            this.$nextTick(() => {
                const last = page.getBoundingClientRect();

                // this.flip(
                //     page,
                //     `scale(${first.width / last.width})`,
                //     `scale(1)`,
                //     () => {
                //         // this.isSettingMode = false;
                //     },
                //     400
                // );
            });
        },

        setCurrentPageFromScroll() {
            if (this.readingMode !== 'continuous') {
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
            if (this.readingMode === 'continuous') {
                return true;
            }

            if (index === this.currentIndex) {
                return true;
            }

            if (this.readingMode === 'split' && index === this.currentIndex + 1) {
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
            }, duration);
        },
    },

    watch: {
        readingMode(value, previous) {
            if (value === 'continuous') {
                const pages = this.$pages;
                let offsetScroll = -41; // toolbar height

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
        currentImage() {
            return this.files[this.currentIndex];
        },

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
            <button class="tool mr-2" @click="open()" title="Open a file">
                <i class="fa fa-folder-open"></i>
            </button>

            <!-- Previous -->
            <button class="tool" title="Previous page" @click="previousImage()">
                <i class="fa fa-chevron-left"></i>
            </button>

            <!-- Current page / Number of pages -->
            <span class="tool text-sm page-number" title="Page number">{{ currentIndex + 1 }} / {{ files.length }}</span>

            <!-- Next -->
            <button class="tool" title="Next page" @click="nextImage()">
                <i class="fa fa-chevron-right"></i>
            </button>

            <!-- Continuous mode -->
            <button class="tool" title="Continuous mode" :class="{active: readingMode === 'continuous'}"
                @click="toggleReadingMode('continuous')">
                <i class="fa fa-angle-double-down"></i>
            </button>

            <!-- Split mode -->
            <button class="tool" title="Split mode" :class="{active: readingMode === 'split'}"
                @click="toggleReadingMode('split')">
                <i class="fa fa-columns"></i>
            </button>

            <!-- Comic name -->
            <span class="title text-sm">
                {{ metadata.title || ''}}
            </span>
        </div>

        <!-- Current progress -->
        <div class="progress-bar">
            <div class="bg-blue" :style="`transform: scaleX(${progress})`"></div>
        </div>
    </div>

    <!-- The pages -->
    <div class="pages" ref="pages" :class="[readingMode]">
        <page v-for="(image, $index) in files" :ref="'page'+$index" :key="$index"
            v-show="isVisible($index)" :path="image"></page>
    </div>
  </div>
</template>
