import { ipcRenderer } from 'electron';
import { Importer } from 'support';

ipcRenderer.on('background:import', (e, path) => {
  Importer.import(path)
    .then((data) => {
      const pages = data.pages.map(p => p.path).toArray();

      ipcRenderer.send('background:done', {
        type: 'import:success',
        data: {
          ...data,
          pages,
        }
      });
    })
    .catch((error) => {
      ipcRenderer.send('background:done', { type: 'import:failed', data: error });
    });
});
