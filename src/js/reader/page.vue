<script>
export default {
    name: 'page',

    props: {
        path: String
    }
}
</script>

<template>
    <div class="reader-page">
        <img :src="path">
    </div>
</template>
