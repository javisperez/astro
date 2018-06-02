<template>
  <router-link
    class="nav-link"
    :to="link"
    v-if="!isExternal(link)"
    :exact="exact"
  >{{ item.text }}</router-link>
  <a
    v-else
    :href="link"
    class="nav-link external"
    :target="isMailto(link) || isTel(link) ? null : '_blank'"
    :rel="isMailto(link) || isTel(link) ? null : 'noopener noreferrer'"
  >
    {{ item.text }}
    <OutboundLink/>
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from './util'

export default {
  props: {
    item: {
      required: true
    }
  },
  computed: {
    link () {
      return ensureExt(this.item.link)
    },
    exact () {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(rootLink => rootLink === this.link)
      }
      return this.link === '/'
    }
  },
  methods: {
    isExternal,
    isMailto,
    isTel
  }
}
</script>

<style lang="scss">
@import './styles/utils';
@import './styles/config';

.nav-link {
  &.action-button {
    background-color: $blue;
    padding: px-to-rem(15px) px-to-rem(25px);
    border-radius: 4px;
    display: inline-block;
    text-decoration: none;

    @include desktop {
      opacity: 0.85;
      transition: all .6s;
      will-change: opacity, transform;
    }

    &:hover {
      text-decoration: none;

      @include desktop {
        opacity: 1;
        transform: scale(1.05);
      }
    }
  }
}
</style>
