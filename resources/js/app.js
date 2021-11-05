require('./bootstrap');

import Vue from "vue";

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import {Vuelidate} from "vuelidate";
Vue.use(Vuelidate)

import App from "./components/App";
import Home from "./components/Home";

//Date filter
import moment from 'moment';
Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('YYYY/MM/DD')
    }
})

//Toastr message
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 3000})

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        }
    ]
})
const app = new Vue ({
    el: '#app',
    components: {App},
    router
})
