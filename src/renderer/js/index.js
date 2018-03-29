import Vue from 'vue';
import { FeatherIcons } from 'support';
import app from './app.vue';
import { webFrame } from 'electron';

Vue.use(FeatherIcons);

// Disable pinch zoom
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

new Vue(app).$mount('#app');
