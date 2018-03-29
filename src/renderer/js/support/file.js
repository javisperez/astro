export default
class File {
    constructor(data) {
        this._name = data.name;
        this._size = data.size;
        this._extension = data.extension || data.name.split('.').pop();
        this._data = data.data;
        this._isDirectory = data.isDirectory;
    }

    /**
     * Name of the file
     */
    get name() {
        return this._name;
    }

    /**
     * Size of the file
     */
    get size() {
        return this._size;
    }

    /**
     * Extension of the file
     */
    get extension() {
        return this._extension;
    }

    /**
     * Data (content) of the file
     */
    get data() {
        return this._data;
    }

    /**
     * Is the file a directory?
     */
    get isDirectory() {
        return this._isDirectory;
    }
}
