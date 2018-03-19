import { File } from 'support';
import Extractor from './extractor';

const Unzip = require('adm-zip');

export default
class CbzExtractor extends Extractor {
    extract(path) {
        const unzip = new Unzip(path);
        const files = unzip.getEntries();

        return files;
    }

    transform(item) {
        return new File({
            name: item.entryName,
            size: item.header.size,
            data: item.getData(),
            isDirectory: item.isDirectory,
        });
    }
}
