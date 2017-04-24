import 'bootstrap-loader';
import 'jquery';
import Vue from 'vue';

const vm = new Vue({
	components: {
		app: require('./views/app.vue')
	},
	el: '#app'
});

if (module.hot) {
	module.hot.accept();
}
