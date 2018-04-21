<script>
import { reader } from 'reader';
import { Extract } from 'extractors';
import { Importer, db } from 'support';
import { remote, ipcRenderer } from 'electron';
import { welcome, loadingScreen } from 'welcome';

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
      extractFailed: false,
    };
  },

  beforeMount() {
    ipcRenderer.on('file:open', (e, file) => {
      this.openFile(file);
    });

    ipcRenderer.on('file:close', (e, file) => {
      this.closeFile();
    });

    ipcRenderer.on('background:import:success', (e, data) => {
      this.comic = {
        title: data.info.title,
        file: data.info.filename,
        pages: data.pages,
        basename: data.info.basename,
        key: data.key,
      };

      this.files = data.pages;

      // Let the progress bar finish
      setTimeout(_ => {
        this.isExtracting = false;
      }, 1000);
    });

    ipcRenderer.on('background:import:failed', (e, data) => {
      this.extractFailed = true;
      this.isExtracting = false;
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
    async openFile(file = null) {
      let _file = file;

      if (!file) {
        _file = await Importer.open();
      }

      this.isExtracting = true;
      ipcRenderer.send('background:import', _file);
    },

    closeFile() {
      this.comic = {};
      this.files = [];
      this.title = '';
      this.currentPage = 0;
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
  <div class="titlebar draggable" :class="{'bg-black': !files.length}"
    @dblclick="maximizeWindow()"></div>

  <!-- App content -->
  <div class="content" v-if="!isExtracting && !extractFailed" key="content">
    <!-- Welcome screen -->
    <welcome @open="openFile" v-if="!files.length" key="welcome"></welcome>

    <!-- Reader -->
    <reader :files="files" :metadata="comic" v-else key="welcome"></reader>
  </div>

  <!-- Loading -->
  <loading-screen :done="!!files.length" :error="extractFailed" key="content" v-else></loading-screen>
</div>
</template>
