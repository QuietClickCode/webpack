
import Vue from 'vue'
import App from './App.vue'
import IvueMaterial from 'ivue-material';

Vue.use(IvueMaterial);
Vue.config.productionTip = false

import 'ivue-material/dist/styles/ivue.css';

new Vue({
    render: h => h(App),
}).$mount('#app')
