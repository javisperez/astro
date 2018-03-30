<script>
import { shell } from 'electron';

export default {
    name: 'astro-home',

    props: {
        value: Array,
    },

    directives: {
        href(el, binding) {
            el.addEventListener('click', () => {
                shell.openExternal(binding.value);
            });
        }
    },

    methods: {
        openFile() {
            this.$emit('open');
        },
    }
}
</script>

<template>
<div class="home flex flex-col overflow-auto justify-start">
    <!-- Logo -->
    <div class="branding-row w-full mb-8 mt-2">
        <div class="branding flex items-center">
            <span class="logo"></span>
            <h1 class="inline m0 font-logo">Astro</h1>
        </div>
    </div>

    <!-- Search -->
    <div class="search mt-8 mb-8 w-full max-w-xs relative">
        <span class="absolute text-grey-dark" style="top: 6px; left: 6px;">
            <fi-search></fi-search>
        </span>
        <input type="text" class="shadow pl-8 appearance-none border rounded w-full py-2 pr-3 text-grey-darker" placeholder="Search titles">
    </div>

    <!-- Default actions -->
    <div class="w-full flex justify-">
        <div class="left-pane w-1/3">
            <!-- Start here -->
            <h3 class="text-left text-xl font-light mb-6 flex items-center">
                <fi-file class="mr-2"></fi-file> Start here
            </h3>
            <span @click="openFile" class="flex items-center text-lg text-yellow-lighter hover:text-yellow cursor-pointer">
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

        <div class="middle-pane w-1/3">
            <h3 class="text-left text-xl font-light mb-6 flex items-center">
                <fi-folder class="mr-2"></fi-folder> Recently Open
            </h3>
            <ul class="list-reset recents-list cursor-pointer">
                <li class="text-grey-darkest text-lg mb-4" v-for="i in 10">
                    <span class="text-yellow-lighter mr-6">Batman - The return.cbz</span> ~/Desktop
                </li>
                <li class="cursor-pointer text-lg text-yellow-dark hover:text-yellow" @click="openFile">Another file?</li>
            </ul>
        </div>

        <div class="right-pane w-1/3">
            <h3 class="text-left text-xl font-light mb-6 flex items-center">
                <fi-bookmark class="mr-2"></fi-bookmark> Bookmarks
            </h3>
            <ul class="list-reset bookmarks cursor-pointer">
                <li class="text-yellow-lighter hover:text-yellow text-lg mb-4" v-for="i in 10">
                    Captain america - Civil War
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
