<script>
import { reader } from 'reader';
import { welcome, loadingScreen } from 'welcome';
import { remote } from 'electron';
import { Importer } from 'support';
import { Extract } from 'extractors';

const win = remote.getCurrentWindow();

// Main app
export default {
    name: 'astro',

    components: {
        welcome,
        loadingScreen,
        reader,
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
                    }
                })
                .then((data) => {
                    this.comic = {
                        title: data.info.title,
                        file: data.info.filename,
                        pages: data.pages,
                        basename: data.info.basename,
                        key: data.key,
                    };
                    this.files = data.pages.map(p => p.path).toArray();
                })
                .catch((error) => {
                    if (error) {
                        alert(error);
                    }
                })
                .then(_ => {
                    this.isExtracting = false;
                });
        },

        maximizeWindow() {
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
        <!-- Invisible and draggable title bar -->
        <div class="titlebar draggable" @dblclick="maximizeWindow()"></div>

        <!-- App content -->
        <div class="content">
            <!-- Welcome screen -->
            <welcome @open="openFile" v-if="!files.length"></welcome>

            <!-- Reader -->
            <reader :files="files" :metadata="comic" @open="openFile" v-else></reader>
        </div>

        <!-- Loading -->
        <loading-screen v-if="isExtracting"></loading-screen>
    </div>
</template>
