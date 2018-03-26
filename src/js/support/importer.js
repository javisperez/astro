import fs from 'fs';
import os from 'os';
import path from 'path';
import { remote } from 'electron';
import { Extract } from 'extractors';

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
        return new Promise((resolve, reject) => {
            remote.dialog.showOpenDialog(
                {
                    filters: [{ name: 'Comic Files', extensions: ['cbr', 'cbz', 'rar', 'zip'] }],
                    ...options
                },

                (files) => {
                    // If the user just cancelled, ignore everything
                    if (!files) {
                        reject(null);
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

                    const basename = path.basename(file, path.extname(file));
                    const fileKey = md5File.sync(file);
                    const tmp = path.join(os.tmpdir(), 'astro', 'cache', fileKey);

                    if (!fs.existsSync(tmp)) {
                        mkdirp.sync(tmp);
                    }

                    // We need this fs.readFile to make it async
                    // @todo find a better way to do this async?
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

                        // Images only
                        let files = Extract.file(file).filter((item) => {
                            const extension = item.name.split('.').pop();

                            if (item.isDirectory) {
                                return false;
                            }

                            return /jpe?g|png|bmp|tiff/gi.test(extension);
                        });

                        // Empty file? nothing else to do
                        if (!files.length) {
                            reject('This file is empty');
                            return;
                        }

                        // Number of pages this file has
                        data.info.pages = files.length;
                        // In what folder is extracted?
                        data.info.folder = tmp;

                        files.forEach((file) => {
                            // Where is this file being extracted to?
                            file.path = path.join(tmp, file.name.split('/').pop());
                            // Write the file content into the file's path
                            fs.appendFileSync(file.path, file.data, { flag: 'w' });
                        });

                        files = files.sortBy('path');

                        // All the pages
                        data.pages = files;

                        // Unique key per file
                        data.key = fileKey;

                        // Resolve it
                        resolve(data);
                    });
                }
            );
        });
    }
}
