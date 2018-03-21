<script>
export default {
    name: 'page',

    props: {
        path: String
    },

    data() {
        return {
            isLoaded: false,
            src: null,
        };
    },

    beforeMount() {
        const img = new Image();
        img.onload = () => {
            this.src = img.src
        };
        img.src = this.path;
    },

    mounted() {
        const img = this.$el.querySelector('img');

        img.onload = () => {
            this.isLoaded = true;
        };
    }
}
</script>

<template>
    <div class="reader-page" :class="{ visible: isLoaded }">
        <img :src="src">
    </div>
</template>
