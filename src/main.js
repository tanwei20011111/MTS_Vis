import Vue from 'vue';
import App from './vue/App.vue';
import './static/css/style.css';
import $ from 'jquery';

import './static/css/bootstrap-4.1.3/css/bootstrap.css';
import './static/css/bootstrap-4.1.3/js/bootstrap.js';
import './static/css/bootstrap-4.1.3/js/bootstrap.bundle.js';




const app = new Vue({
	el: "#app",
	template: '<App/>',
	components: {
		App
	},

});