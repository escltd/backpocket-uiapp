import Vue from 'vue'
import Vuex from 'vuex'


import assets from "./modules/assets"
import assetSocket from "./plugins/assets"

import orders from "./modules/orders"
import orderSocket from "./plugins/orders"

import trades from "./modules/trades"
import tradeSocket from "./plugins/trades"

import orderbooks from "./modules/orderbooks"
import orderbookSocket from "./plugins/orderbooks"

import marketpairs from "./modules/marketpairs"
import marketpairSocket from "./plugins/marketpairs"

import notifications from "./modules/notifications"
import notificationSocket from "./plugins/notifications"

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        assets,
        orders,
        trades,
        orderbooks,
        marketpairs,
        notifications
    },
    plugins: [assetSocket(), orderSocket(), tradeSocket(), orderbookSocket(), marketpairSocket(), notificationSocket()]
})
