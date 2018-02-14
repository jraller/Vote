import Vue from 'vue';
import Vuetify from 'vuetify';

import store from './modules/store';

Vue.config.silent = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';
Vue.config.performance = false;

// https://forum.vuejs.org/t/vuex-best-practices-for-complex-objects/10143/2 for design of state object

// TODO look at setting up Vue modules per https://www.coding123.org/mock-vuex-in-vue-unit-tests/
// TODO look at inject-loader and babel-plugin-rewire per https://www.coding123.org/stub-dependencies-vue-unit-tests/

// Vue.prototype.$eventHub = new Vue();

Vue.use(Vuetify);

const vm = new Vue({
	components: {
		app: require('./views/app.vue').default,
	},
	el: '#app',
	store,
});

if (module.hot) {
	module.hot.accept();
}
