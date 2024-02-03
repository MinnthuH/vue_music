import './assets/base.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation'; // validation plugin add
import { auth } from './includes/firebase';
import Icon from './directives/icon';
import I18n from './includes/i18n';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin); // validation plugin use
    app.use(I18n); // i18n plugin use

    app.directive('icon', Icon); // directive use
    app.mount('#app');
  }
});
