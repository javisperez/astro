import { Collection } from 'support';

export default
class Extractor {
    /**
     * Run the extractor
     * @param {string} path - The path to the file to extract
     */
    run(path) {
        const collection = new Collection();
        const files = this.extract(path);

        files.forEach(file => {
            collection.add(this.transform(file));
        });

        return collection;
    }

    /**
     * Abstract method to actually extract the file
     */
    extract() {
        throw new Error('Missing _extract_ method on extractor');
    }

    /**
     * Abstract method to transform the data to standardize it
     */
    transform() {
        throw new Error('Missing _transform_ method on extractor');
    }
}
