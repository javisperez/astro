<script>
import { reader } from 'reader';
import { remote } from 'electron';
import { Importer } from 'support';
import { Extract } from 'extractors';

const win = remote.getCurrentWindow();

// Main app
export default {
    name: 'astro',

    components: {
        reader
    },

    data() {
        return {
            isExtracting: false,
            comic: {},
            files: [],
            title: '',
            currentPage: 0,
        };
    },

    methods: {
        openFile() {
            Importer.open({
                    onSelect: (filename) => {
                        this.isExtracting = true;
                        this.title = `Importing ${filename}...`;
                        // Clear the files to re-render the reader
                        this.files = [];
                    }
                })
                .then((data) => {
                    this.currentPage = 0;
                    this.comic = {
                        title: data.info.title,
                        file: data.info.filename,
                        pages: data.pages,
                        basename: data.info.basename,
                        key: data.key,
                    };
                    this.files = data.pages.map(p => p.path).toArray();
                    this.isExtracting = false;
                    this.title = `You're reading "${data.info.basename}"`
                })
                .catch((error) => {
                    if (error) {
                        alert(error);
                    }
                    this.isExtracting = false;
                });
        },

        maximizeWindow() {
            console.log('doble click');
          if (!win.isMaximized()) {
            win.maximize();
          } else {
            win.unmaximize();
          }
        },
    }
};
</script>

<template>
    <div class="app window">
        <!-- Title bar -->
        <div class="titlebar draggable" @dblclick="maximizeWindow()">
            <!-- <span class="title">
                <span v-if="title">{{ title }} -&nbsp;</span>Astro
            </span> -->
        </div>

        <!-- App content -->
        <div class="content">
            <!-- Default state -->
            <div class="home" v-if="!files.length">
                <button @click="openFile" class="flex items-center btn text-xl text-grey-darker outline-none hover:text-grey">
                    <fi-folder class="mr-2"></fi-folder> Start Here
                </button>
            </div>

            <!-- Reader -->
            <reader :files="files" :metadata="comic" @open="openFile" :current-page="currentPage" v-if="files.length"></reader>
        </div>

        <!-- Loading -->
        <div class="extracting" v-show="isExtracting">
            <fi-loader class="fi-spin"></fi-loader>
            <p class="mt-2">Working...</p>
        </div>
    </div>
</template>
