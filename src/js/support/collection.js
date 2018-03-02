export default
class Collection {
    /**
     * Initialize the class instance
     * @param {Array} array - Initializing array
     */
    constructor(array = []) {
        this.items = new Set(array);
    }

    /**
     * Add an item to the collection
     * @param {*} item - Item to add
     * @memberof Collection
     */
    add(item) {
        this.items.add(item);
    }

    /**
     * Get all the items
     * @memberof Collection
     */
    all() {
        return this.items;
    }

    /**
     * Foreach
     * @param {Function} fn - A callback function to validate
     * @memberof Collection
     */
    forEach(fn) {
        return this.items.forEach(fn);
    }

    /**
     * File the collection
     *
     * @param {Function} fn - A function to validate the filter
     * @memberof Collection
     */
    filter(fn) {
        const filtered = new Collection();

        this.forEach(item => {
            if (fn(item)) {
                filtered.add(item);
            }
        });

        return filtered;
    }

    /**
     * Length of the set
     */
    get length() {
        return this.items.size;
    }
}
