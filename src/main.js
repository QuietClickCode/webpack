
import Vue from 'vue'
import App from './App.vue'
import IvueMaterial from 'ivue-material'
import 'ivue-material/dist/styles/ivue.css'

Vue.use(IvueMaterial);
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
