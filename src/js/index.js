import Vue from 'vue';
import app from './app.vue';
import { webFrame } from 'electron';

// Disable pinch zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

new Vue(app).$mount('#app');
