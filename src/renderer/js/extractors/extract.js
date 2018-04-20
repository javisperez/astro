import Cbz from './cbz';
import Cbr from './cbr';

export default
class Extract {
  getExtractor() {
    // @todo find a better way to do this
    const classMap = {
      cbr: Cbr,
      cbz: Cbz
    };

    const Extractor = classMap[this.extension];
    return new Extractor();
  }

  static file(path) {
    const self = new Extract();
    self.extension = path.split('.').pop();

    return self.getExtractor().run(path);
  }
}
