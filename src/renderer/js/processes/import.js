import { Importer } from 'support';

Caller.on('import', (e, path) => {
  Importer.import(path)
    .then((data) => {
      const pages = data.pages.map(p => p.path).toArray();

      Caller.send('success', { ...data, pages });
    })
    .catch((error) => {
      Caller.send('error', error);
    });
});
