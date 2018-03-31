import fs from 'fs';
import os from 'os';
import path from 'path';
import { remote } from 'electron';
import { Extract } from 'extractors';
import { Collection, File } from 'support';

const mkdirp = require('mkdirp');
const md5File = require('md5-file');

export default
class Importer {
    /**
     * Open a dialog to import a comic file
     * @param {Object} options - The options to pass to the remote.dialog object
     * @return Promise
     */
    static open(options) {
        const self = new Importer();

        return new Promise((resolve, reject) => {
            remote.dialog.showOpenDialog(
                {
                    filters: [{ name: 'Comic Files', extensions: ['cbr', 'cbz', 'rar', 'zip'] }],
                    ...options
                },

                (files) => {
                    // If the user just cancelled, ignore everything
                    if (!files) {
                        return;
                    }

                    let file = files[0];

                    if (process.platform === 'win32') {
                        file = file.replace(/\//g, '\\');
                    }

                    // Run callback when a file is selected
                    if (options.onSelect) {
                        options.onSelect(file);
                    }

                    resolve(self.import(file));
                }
            );
        });
    }

    /**
     * Import a given file path
     * @param {string} file - The path to the file to open
     */
    import(file = null) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(`Tried to import a file with invalid path ${file}`);
                return;
            }

            const basename = path.basename(file, path.extname(file));
            const fileKey = md5File.sync(file);
            const tmp = path.join(os.tmpdir(), 'astro', 'cache', fileKey);
            const isCached = fs.existsSync(tmp);

            if (!isCached) {
                mkdirp.sync(tmp);
            }

            // We need this fs.readFile to make it async
            fs.readFile(file, (err) => {
                // Something's not right
                if (err) {
                    reject(err);
                    return;
                }

                // The output object
                const data = {
                    info: {
                        filename: file,
                        basename,
                        title: basename.replace(/_/ig, ' '),
                    }
                };

                let files = [];

                if (isCached) {
                    // If we already have a cache folder, use it
                    files = this.fromCache(tmp);
                } else {
                    // Otherwise, read it from the file
                    files = this.fromFile(file);
                }

                // Empty file? nothing else to do
                if (!files.length) {
                    reject('This file is empty');
                    return;
                }

                // Populate the cache files, if doesn't exists
                if (!isCached) {
                    files.forEach((file) => {
                        // Where is this file being extracted to?
                        file.path = path.join(tmp, file.name.split('/').pop());
                        // Write the file content into the file's path
                        fs.appendFileSync(file.path, file.data, { flag: 'w' });
                    });
                }

                // Number of pages this file has
                data.info.pages = files.length;

                // In what folder is extracted?
                data.info.folder = tmp;

                files = files.sortBy('path');

                // All the pages
                data.pages = files;

                // Unique key per file
                data.key = fileKey;

                // Resolve it
                resolve(data);
            });
        });
    }

    /**
     * Import from a cached version
     *
     * Note: This method is supposed to be used as a helper for the `import` method
     * Note: Files returned from cache doesn't have a `data` property, as is not need it
     *       we prefer to save that CPU and memory
     * @param {String} name - The cache folder name
     */
    fromCache(name) {
        const collected = fs.readdirSync(name)
            .map(f => new File({
                name: f,
                size: fs.statSync(path.join(name, f)).size,
                isDirectory: false,
            }))
            .map(f => {
                f.path = path.join(name, f.name);
                return f;
            });

        return new Collection(collected);
    }

    /**
     * Import from a given file path.
     *
     * Note: This method is supposed to be used as a helper for the `import` method
     * @param {String} file - The file path
     */
    fromFile(file) {
        return Extract.file(file).filter((item) => {
            const extension = item.name.split('.').pop();

            if (item.isDirectory) {
                return false;
            }

            return /jpe?g|png|bmp|tiff/gi.test(extension);
        });
    }
}
