<script>
export default {
    name: 'page',

    props: {
        path: String
    },

    data() {
        return {
            isLoaded: false,
        };
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
            <img :src="path">
    </div>
</template>
