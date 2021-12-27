import Vue from "vue"
import Vuex from 'vuex'
import App from "./app.vue"
import store from "@/store/store"
import { router } from "@/routes"

Vue.use(Vuex)

new Vue ({
  el: "#appbody",
  router, store,
  render: h => h(App)
})
