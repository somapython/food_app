import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import $ from 'jquery';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'leaflet/dist/leaflet.css';
window.$ = $;
window.jQuery = $;

createApp(App).use(store).use(router).mount('#app');


