import fs from 'fs';
import { File } from 'support';
import Extractor from './extractor';

const Unrar = require('electron-unrar-js');

export default
class CbrExtractor extends Extractor {
    extract(path) {
        const buffer = Uint8Array.from(fs.readFileSync(path)).buffer;
        const unrar = Unrar.createExtractorFromData(buffer);
        const extracted = unrar.extractAll();

        if (!extracted[1]) {
            return [];
        }

        return extracted[1].files;
    }

    transform(item) {
        let data = null;

        // Folders doesn't have data
        if (!item.fileHeader.flags.directory) {
            data = new Buffer(item.extract[1]);
        }

        return new File({
            name: item.fileHeader.name,
            size: item.fileHeader.unpSize,
            data,
            isDirectory: item.fileHeader.flags.directory,
        });
    }
}
