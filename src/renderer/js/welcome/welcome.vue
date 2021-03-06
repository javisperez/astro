<script>
import { shell, remote } from 'electron';
import { db, Helper } from 'support';

export default {
  name: 'astro-home',

  props: {
    value: Array,
  },

  created() {
    // Get the recent files
    db.recent.orderBy('updated_at').reverse().limit(15).toArray().then(recent => {
      this.recent = recent;
    });

    // And the bookmarks
    db.bookmarks.toArray().then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  },

  data() {
    return {
      recent: [],
      bookmarks: [],
      search: '',
    };
  },

  directives: {
    href(el, binding) {
      el.addEventListener('click', () => {
        shell.openExternal(binding.value);
      });
    }
  },

  methods: {
    openFile(file = null) {
      this.$emit('open', file);
    },

    getShortPath(file) {
      return Helper.getShortPath(file.path.replace(file.title, '')).slice(0, -1);
    },
  },

  computed: {
    filteredRecent() {
      if (!this.search) {
        return this.recent;
      }

      return this.recent.filter(r => r.path.toLowerCase().includes(this.search.toLowerCase()))
    },

    filteredBookmarks() {
      if (!this.search) {
        return this.bookmarks;
      }

      return this.bookmarks.filter(r => r.path.toLowerCase().includes(this.search.toLowerCase()))
    },

    platform() {
      return process.platform;
    }
  }
}
</script>

<template>
<div class="home flex flex-col overflow-auto justify-start px-16 pb-16 pt-8"
  :class="{'pt-16': platform === 'darwin'}">
  <!-- Logo -->
  <div class="branding-row w-full mb-8 mt-2">
    <div class="branding flex items-center">
      <span class="logo"></span>
      <h1 class="inline m0 font-logo">Astro</h1>
    </div>
  </div>

  <!-- Search -->
  <div class="search mb-8 w-full max-w-xs relative">
    <span class="absolute text-grey-dark" style="top: 6px; left: 6px;">
      <fi-search></fi-search>
    </span>
    <input type="text" v-model="search" class="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-grey-darker" placeholder="Search titles">
  </div>

  <!-- Default actions -->
  <div class="w-full flex mt-8">
    <div class="left-pane w-1/3 pr-2">
      <!-- Start here -->
      <h3 class="text-left text-xl font-light mb-6 flex items-center">
        <fi-file class="mr-2"></fi-file> Start here
      </h3>
      <span @click="openFile()" class="flex items-center text-lg text-yellow-lighter hover:text-yellow cursor-pointer">
        Open a comic
      </span>

      <!-- Help -->
      <h3 class="text-left text-xl font-light mb-6 mt-8 flex items-center">
        <fi-help-circle class="mr-2"></fi-help-circle> Help
      </h3>
      <ul class="list-reset">
        <li class="mb-6">
          <a class="cursor-pointer text-lg text-yellow-lighter hover:text-yellow no-underline" v-href="'https://www.github.com/javisperez/astro/issues'">
            Open a new issue
          </a>
        </li>
        <li class="mb-6">
          <a class="cursor-pointer text-lg text-yellow-lighter hover:text-yellow no-underline" v-href="'https://www.github.com/javisperez/astro'">
            Want to Contribute?
          </a>
        </li>
      </ul>
    </div>

    <div class="middle-pane w-1/3 px-2">
      <h3 class="text-left text-xl font-light mb-6 flex items-center">
        <fi-folder class="mr-2"></fi-folder> Recently Open
      </h3>
      <ul class="list-reset recent-list" v-if="filteredRecent.length" key="recent-list">
        <li v-for="file in filteredRecent" :key="file.id" @click="openFile(file.path)" class="cursor-pointer text-grey-darkest text-lg mb-4">
          <span class="text-yellow-lighter mr-6">{{ file.title }}</span> {{ getShortPath(file) }}
        </li>
        <li class="cursor-pointer text-lg text-yellow-dark hover:text-yellow" @click="openFile()">{{ filteredRecent.length ? 'Another file?' : 'Open a file'}}</li>
      </ul>
      <div v-else key="recent-list">
        No file was open recently
      </div>
    </div>

    <div class="right-pane w-1/3 pl-2">
      <h3 class="text-left text-xl font-light mb-6 flex items-center">
        <fi-bookmark class="mr-2"></fi-bookmark> Bookmarks
      </h3>
      <ul class="list-reset bookmarks">
        <li v-for="bookmark in filteredBookmarks" :key="bookmark.id" @click="openFile(bookmark.path)" class="cursor-pointer text-yellow-lighter hover:text-yellow text-lg mb-4">
          {{ bookmark.title }}
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
