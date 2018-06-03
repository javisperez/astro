<template>
  <div class="home">
    <h1 class="description">
      {{ data.tagline || $description }}
    </h1>
    <div class="preview-screenshot" v-if="data.previewImage">
      <img :src="data.previewImage" :alt="data.tagline"/>
    </div>
    <div class="content">
      <Downloads/>
      <div class="features" v-if="data.features && data.features.length">
        <div class="feature" v-for="feature in data.features">
          <span class="feature-icon" v-html="feature.icon"></span>
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.details }}</p>
        </div>
      </div>
      <Content custom/>
    </div>
  </div>
</template>

<script>
import NavLink from './NavLink.vue'
import Downloads from './Downloads'

export default {
  components: { NavLink, Downloads },
  computed: {
    data () {
      return this.$page.frontmatter
    },
    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="scss">
@import './styles/utils';
@import './styles/config';

.home {
  text-align: center;
  padding: px-to-rem(10px);
}

.description {
  font-size: $fs-lg;
  font-weight: 100;
  margin-bottom: px-to-rem(60px);

  @include desktop {
    font-size: $fs-xl;
  }
}

.preview-screenshot {
  margin: 0 auto;
  margin-bottom: px-to-rem(60px);
  width: 100%;
  max-width: $container-width;
  box-sizing: border-box;

  img {
    width: 100%;
    box-shadow: 0 0 60px $black;
  }
}

.features {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: $container-width;
  margin: px-to-rem(100px) auto;
  justify-content: space-between;

  svg {
    color: $white;
  }

  @include desktop {
    flex-direction: row;
  }

  .feature {
    width: 100%;
    margin-bottom: px-to-rem(40px);

    @include desktop {
      width: 30%;
      margin-bottom: 0;
    }
  }
}
</style>
