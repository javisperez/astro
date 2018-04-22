import Vue from 'vue';
import { FeatherIcons } from 'support';
import app from './app.vue';
import { webFrame, remote } from 'electron';

const buildEditorContextMenu = remote.require('electron-editor-context-menu');

window.addEventListener('contextmenu', function(e) {
  // Only show the context menu in text editors.
  if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
    return;
  }

  const menu = buildEditorContextMenu();

  // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
  // visible selection has changed. Try to wait to show the menu until after that, otherwise the
  // visible selection will update after the menu dismisses and look weird.
  setTimeout(() => { menu.popup(remote.getCurrentWindow()); }, 30);
});

Vue.use(FeatherIcons);

// Disable pinch zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

new Vue(app).$mount('#app');
