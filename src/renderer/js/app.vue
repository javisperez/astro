<script>
import { reader } from 'reader';
import { welcome, loadingScreen } from 'welcome';
import { remote, ipcRenderer } from 'electron';
import { Importer, db } from 'support';
import { Extract } from 'extractors';

const win = remote.getCurrentWindow();

// Tell the Menu the list of recent files
db.recent.orderBy('updated_at').reverse().limit(15).toArray().then(recent => {
    ipcRenderer.send('recent:update', recent);
});

// And the bookmarks
db.bookmarks.toArray().then(bookmarks => {
    ipcRenderer.send('bookmarks:update', bookmarks);
});

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

    beforeMount() {
        ipcRenderer.on('file:open', _ => {
            this.openFile();
        });

        ipcRenderer.on('bookmarks:add', _ => {
            if (!this.comic.title) {
                return;
            }

            db.bookmarks.add({
                title: this.comic.title,
                path: this.comic.file,
                updated_at: Date.now(),
            });

            // Update the menu's bookmarks
            db.bookmarks.toArray().then(bookmarks => {
                ipcRenderer.send('bookmarks:update', bookmarks);
            });
        });

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

                    // Let the progress bar finish
                    setTimeout(_ => {
                        this.isExtracting = false;
                    }, 1000);
                })
                .catch((error) => {
                    if (error) {
                        alert(error);
                    }

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
        <div class="titlebar draggable" :class="{'bg-black': !files.length}" @dblclick="maximizeWindow()"></div>

        <!-- App content -->
        <div class="content" v-if="!isExtracting">
            <!-- Welcome screen -->
            <welcome @open="openFile" v-if="!files.length"></welcome>

            <!-- Reader -->
            <reader :files="files" :metadata="comic" v-else></reader>
        </div>

        <!-- Loading -->
        <loading-screen :done="!!files.length" v-else></loading-screen>
    </div>
</template>
