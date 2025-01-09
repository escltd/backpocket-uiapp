//splash-screen
// import loadingComponent from "@/components/loading"

import contactusComponent from "@/components/contactus";
import privacyComponent from "@/components/privacy";
import termComponent from "@/components/term";


import opportunityComponent from "@/components/opportunity";
import assetsComponent from "@/components/assets";
import ordersComponent from "@/components/orders";
import marketsComponent from "@/components/markets";
import predictComponent from "@/components/predict";

import loginComponent from "@/components/login"
import forgotComponent from "@/components/forgot"
import registerComponent from "@/components/register"

import joinComponent from "@/components/login"

import Router from "vue-router";
import Vue from "vue";


Vue.use(Router);
export const router = new Router({
  mode: "hash",
  routes: [
    { path: "", component: marketsComponent },

    { path: "/join", component: joinComponent },
    { path: "/login", component: loginComponent },
    { path: "/forgot", component: forgotComponent },
    { path: "/register", component: registerComponent },

    { path: "/assets", component: assetsComponent },
    { path: "/orders", component: ordersComponent },
    { path: "/markets", component: marketsComponent },
    { path: "/predict", component: predictComponent },
    { path: "/opportunity", component: opportunityComponent },

    { path: "/contact", component: contactusComponent },
    { path: "/privacy", component: privacyComponent },
    { path: "/terms", component: termComponent },
  ]
});
