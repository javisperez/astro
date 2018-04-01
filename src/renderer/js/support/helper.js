import { remote } from 'electron';

export default
class Helper {
    static getShortPath(path) {
        const home = remote.app.getPath('home');

        return path.replace(home, '~');
    }
}
