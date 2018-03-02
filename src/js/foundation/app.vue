<script>
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { reader } from 'reader';
import { Extract } from 'support';

const md5File = require('md5-file')
const mkdirp = require('mkdirp');
const win = remote.getCurrentWindow();

// Main app
export default {
    name: 'astro',

    components: {
        reader
    },

    data() {
        return {
            isExtracting: false,
            comic: '',
            files: []
        };
    },

    methods: {
        beforeCreate() {
            document.title = 'Astro Comics Reader';
        },

        readFile() {
            remote.dialog.showOpenDialog(
                {
                    filters: [{
                        name: 'Comic Files',
                        extensions: ['cbr', 'cbz', 'rar', 'zip']
                    }]
                },
                // Open File function
                (fileNames) => {
                    if (fileNames === undefined) {
                        return;
                    }

                    this.isExtracting = true;

                    let fileName = fileNames[0];

                    if (process.platform == 'win32') {
                        fileName = fileName.replace(/\//g, '\\');
                    }

                    const basename = path.basename(fileName, path.extname(fileName));

                    this.comic = basename.replace(/_/ig, ' ');

                    let tempFolder = path.join(os.tmpdir(), 'astro', 'cache', md5File.sync(fileName));

                    if (fs.existsSync(tempFolder)) {
                        console.log('FILE EXISTS @', tempFolder);
                    } else {
                        mkdirp.sync(tempFolder);
                    }

                    // We need tthis fs.readFile to make it async
                    // @todo find a better way to do this async?
                    fs.readFile(fileName, (err) => {
                        // Images only
                        const files = Extract.file(fileName).filter((item) => {
                            const extension = item.name.split('.').pop();

                            if (item.isDirectory) {
                                return false;
                            }

                            return /jpe?g|png|bmp|tiff/gi.test(extension);
                        });

                        if (!files.length) {
                            this.isExtracting = false;
                            return;
                        }

                        files.forEach((file) => {
                            const destFile = file.name.split('/').pop();
                            fs.appendFileSync(path.join(tempFolder, destFile), file.data);
                        });

                        localStorage.setItem('temp-folder', tempFolder);

                        // Let's go to the reader
                        this.files = fs.readdirSync(tempFolder).map(f => `${tempFolder}/${f}`);

                        this.isExtracting = false;
                    });
                }
            );
        },

        closeWindow() {
            win.close();
        },

        minimizeWindow() {
            win.minimize();
        },

        maximizeWindow() {
          if (!win.isMaximized()) {
            win.maximize();
          } else {
            win.unmaximize();
          }
        },
    },

    computed: {
        isHome() {
            return !this.isExtracting && !this.files.length;
        }
    }
};
</script>

<template>
    <div class="app window">
        <!-- Title bar -->
        <div class="titlebar draggable" @dblclick="maximizeWindow()">
            <!-- Close -->
            <span class="titlebar-button close undraggable" @click="closeWindow()">
                <i class="fa fa-times-circle"></i>
            </span>
            <!-- Minimize -->
            <span class="titlebar-button undraggable" @click="minimizeWindow()">
                <i class="fa fa-minus-circle"></i>
            </span>
            <!-- Maximize -->
            <span class="titlebar-button undraggable" @click="maximizeWindow()">
                <i class="fa fa-plus-circle"></i>
            </span>
        </div>

        <!-- App content -->
        <div class="content">
            <!-- Default home -->
            <div class="toolbar" v-if="isHome">
                <button @click="readFile">
                    <i class="fa fa-folder-open"></i>
                </button>
            </div>

            <!-- Loading -->
            <div class="extracting" v-show="isExtracting">
                <i class="fa fa-spin fa-cog"></i>
            </div>

            <!-- Reader -->
            <reader :files="files" @open="readFile" v-if="files.length"></reader>
        </div>
    </div>
</template>
