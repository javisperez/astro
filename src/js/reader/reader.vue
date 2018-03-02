<script>
import fs from 'fs';
import page from './page.vue';

export default {
    name: 'reader',

    components: {
        page
    },

    props: {
        files: {
            type: Array
        }
    },

    data() {
        return {
            currentImageIndex: 0
        };
    },

    methods: {
        open() {
            this.$emit('open');
        },

        nextImage() {
            this.currentImageIndex = Math.min(this.files.length - 1, this.currentImageIndex + 1);
        },

        previousImage() {
            this.currentImageIndex = Math.max(0, this.currentImageIndex - 1);
        }
    },

    computed: {
        currentImage() {
            return this.files[this.currentImageIndex];
        }
    }

}
</script>

<template>
  <div>
    <!-- toolbar -->
    <div class="toolbar">
        <button @click="open()">
            <i class="fa fa-folder-open"></i>
        </button>

        <button @click="previousImage()">
            <i class="fa fa-chevron-left"></i>
        </button>
        {{ currentImageIndex + 1 }} / {{ files.length }}
        <button @click="nextImage()">
            <i class="fa fa-chevron-right"></i>
        </button>
    </div>

    <div class="reader">
        <page v-for="(image, $index) in files" :key="$index" v-show="$index === currentImageIndex" :path="image"></page>
    </div>
  </div>
</template>
