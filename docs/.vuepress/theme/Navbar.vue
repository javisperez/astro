<template>
  <header class="navbar">
    <router-link :to="$localePath" class="home-link">
      <img class="logo"
        v-if="$site.themeConfig.logo"
        :src="$withBase($site.themeConfig.logo)">
      <span class="logo-text">{{ $site.themeConfig.name }}</span>
    </router-link>
    <div class="links">
      <NavLinks/>
    </div>
  </header>
</template>

<script>
import NavLinks from './NavLinks.vue'

export default {
  components: { NavLinks }
}
</script>

<style lang="scss">
@import './styles/utils';
@import './styles/config';

.navbar {
  padding: px-to-rem(20px);
  padding-top: px-to-rem(40px);
  margin-bottom: px-to-rem(80px);
  text-align: center;
  color: $white;
}

.home-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  .logo {
    width: 100px;
  }

  .logo-text {
    font-family: BigNoodleTitling;
    font-size: px-to-rem(72px);
    font-weight: 100;
    color: $white;
    margin-left: 20px;
    display: none;

    @include desktop {
      display: inline;
    }
  }
}
</style>

