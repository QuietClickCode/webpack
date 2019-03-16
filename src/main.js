
import Vue from 'vue'
import App from './App.vue'
import { IvueButton } from 'ivue-material';

Vue.component('IvueButton', IvueButton);
Vue.config.productionTip = false

import 'ivue-material/dist/styles/ivue.css';

new Vue({
    render: h => h(App),
}).$mount('#app')
