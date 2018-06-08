<template>
  <p class="downloads">
    <NavLink class="action-button" :item="primaryAction"/>
    <br>
    <span class="secondary-download">
      ...or download for <a :href="secondaryAction.link">{{ secondaryAction.text }}</a>
    </span>
  </p>
</template>

<script>
import NavLink from './NavLink.vue'

export default {
  components: { NavLink },

  created() {
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (macosPlatforms.indexOf(platform) !== -1) {
      this.primaryAction = {
        text: 'Download for macOS',
        link: '/'
      };
      this.secondaryAction = {
        text: 'Windows',
        link: '/'
      }
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      this.primaryAction = {
        text: 'Download for Windows',
        link: '/'
      };
      this.secondaryAction = {
        text: 'macOS',
        link: '/'
      }
    }
  },

  data() {
    return {
      primaryAction: {
        text: 'Download Now',
        link: '/',
      },
      secondaryAction: {
        text: 'Windows',
        link: '/'
      }
    }
  },
}
</script>

<style lang="scss">
@import './styles/utils';
@import './styles/config';

.downloads {
  .action-button {
    font-size: $fs-m;
    color: $white;
  }

  .secondary-download {
    margin-top: 20px;
    display: inline-block;
  }
}
</style>
