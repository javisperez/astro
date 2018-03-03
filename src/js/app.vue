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
        };
    },

    methods: {
        openFile() {
            Importer.open({
                    onSelect: (filename) => {
                        this.isExtracting = true;
                        this.title = `Importing ${filename}...`
                    }
                })
                .then((data) => {
                    this.comic = {
                        title: data.info.title,
                        file: data.info.filename,
                        pages: data.pages,
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

        closeWindow() {
            win.close();
        },

        minimizeWindow() {
            win.minimize();
        },

        maximizeWindow() {
          if (!win.isMaximized()) {
            win.maximize();
          } else {
            win.unmaximize();
          }
        },
    },

    computed: {
        process() {
            return process;
        }
    }
};
</script>

<template>
    <div class="app window">
        <!-- Title bar -->
        <div class="titlebar draggable" :class="{'windows': process.platform === 'win32'}" @dblclick="maximizeWindow()">
            <!-- Close -->
            <span class="titlebar-button close undraggable" @click="closeWindow()">
                <i class="fa fa-times-circle"></i>
            </span>
            <!-- Minimize -->
            <span class="titlebar-button minimize undraggable" @click="minimizeWindow()">
                <i class="fa fa-minus-circle"></i>
            </span>
            <!-- Maximize -->
            <span class="titlebar-button maximize undraggable" @click="maximizeWindow()">
                <i class="fa fa-plus-circle"></i>
            </span>

            <span class="title">
                <span v-if="title">{{ title }} - </span>Astro
            </span>
        </div>

        <!-- App content -->
        <div class="content">
            <!-- Default state -->
            <div class="home" v-if="!files.length">
                <button @click="openFile" class="btn text-xl text-grey">
                    <i class="fa fa-folder-open"></i> Open
                </button>
            </div>

            <!-- Loading -->
            <div class="extracting" v-show="isExtracting">
                <i class="fa fa-spin fa-cog"></i>
            </div>

            <!-- Reader -->
            <reader :files="files" :metadata="comic" @open="openFile" v-if="files.length"></reader>
        </div>
    </div>
</template>
