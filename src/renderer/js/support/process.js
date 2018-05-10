import fs from 'fs';
import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import { remote, ipcRenderer } from 'electron';

const { BrowserWindow } = remote;

const processes = path.join(os.tmpdir(), 'astro', 'processes');

if (!fs.existsSync(processes)) {
  mkdirp.sync(processes);
}

class Process {
  constructor(filepath, options = {}) {
    this.id = (new Date()).getTime();
    this.queue = {};

    const indexFile = this._generateIndexFile(filepath);

    const bg = new BrowserWindow({
      width: 600,
      height: 600,
      ...options,
      show: false,
    });

    bg.once('ready-to-show', () => {
      if (options.show) {
        bg.show();
      }

      this.runQueue();
    });

    bg.loadURL(`file://${indexFile}`);

    this.window = bg;
  }

  _generateIndexFile(filepath) {
    // create an index.html file on the tmp dir with a file path of the constructor’s filepath
    // return index.html path
    const content = `
      <html>
        <head>
          <script>
          const { ipcRenderer, remote } = require('electron');

          class ProcessCaller {
            constructor() {
              this.id = ${this.id};
            }

            send(e, message) {
              remote.getCurrentWindow().emit('process:${this.id}:'+e, message);
            }

            on(e, cb) {
              ipcRenderer.on('process:${this.id}:'+e, cb);
            }
          }
          const Caller = new ProcessCaller();
          </script>
          <script src="file://${remote.app.getAppPath()}/dist/js/${filepath}"></script>
        </head>
        <body>THIS IS A CHILD PROCESS</body>
      </html>
    `;
    const index = `${path.join(processes, this.id.toString())}.html`;

    fs.appendFileSync(index, content, { flag: 'w' });

    return index;
  }

  on(e, cb) {
    this.window.on(`process:${this.id}:${e}`, cb);
  }

  send(e, message) {
    const fullmessage = `process:${this.id}:${e}`;

    if (!this.queue[fullmessage]) {
      this.queue[fullmessage] = [];
    }

    this.queue[fullmessage].push(message);

    this.window.send(fullmessage, message);
  }

  runQueue() {
    for (const e in this.queue) {
      for (const message of this.queue[e]) {
        this.window.send(e, message);
      }
    }
  }

  terminate() {
    this.queue = {};
    this.window.close();
    this.window = null;
  }
}

export default Process;
