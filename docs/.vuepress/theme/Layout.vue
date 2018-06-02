<template>
  <div class="theme-container"
    :class="pageClasses">
    <Navbar v-if="shouldShowNavbar"/>
    <div class="custom-layout" v-if="$page.frontmatter.layout">
      <component :is="$page.frontmatter.layout"/>
    </div>
    <Home v-else-if="$page.frontmatter.home"/>
    <Page v-else>
      <slot name="page-top" slot="top"/>
      <slot name="page-bottom" slot="bottom"/>
    </Page>
    <footer class="footer" v-if="$page.frontmatter.footer">
      {{ $page.frontmatter.footer }}
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import nprogress from 'nprogress'
import Home from './Home.vue'
import Navbar from './Navbar.vue'
import Page from './Page.vue'
import { resolveSidebarItems } from './util'

export default {
  components: { Home, Page, Navbar },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false ||
        themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        userPageClass
      ]
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)

    // configure progress bar
    nprogress.configure({ showSpinner: false })

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        nprogress.start()
      }
      next()
    })

    this.$router.afterEach(() => {
      nprogress.done()
    })
  },
}
</script>

<style src="./styles/theme.scss" lang="scss"></style>
