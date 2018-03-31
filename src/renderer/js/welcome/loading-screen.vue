<script>
export default {
    name: 'astro-loading-screen',

    props: {
        done: Boolean,
    },

    mounted() {
        setTimeout(_ => {
            this.$refs.progressBar.style.transform = 'scaleX(1)';
        });
    }
}
</script>

<template>
<div class="loading-screen">
    <p class="mt-2">
        <div class="logo-bg"></div>

        <div class="progress-bar" :class="{'done': done}">
            <div class="bar" ref="progressBar"></div>
        </div>
    </p>
</div>
</template>
