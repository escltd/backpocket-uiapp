const state = {
    orderHistory: {}, marketPairOrders: {}, orderHistoryCount: 0,
}

const getters = {
    getOrderHistory: state => state.orderHistory,
    getMarketPairOrders: state => state.marketPairOrders,
    getOrderHistoryCount: state => state.orderHistoryCount,
}

const actions = {
    updateOrder({commit},orderList) {
        commit('UPDATE_ORDER',orderList)
    },
    updateOrderHistory({commit},orderHistoryList) {
        commit('UPDATE_ORDER_HISTORY', orderHistoryList)
    },
    createOrder({commit},order) {
        commit('CREATE_ORDER',order)
    },
    cancelOrder({commit},order) {
        commit('CANCEL_ORDER',order)
    },
    disableStrategy({commit},order) {
        commit('DISABLE_STRATEGY',order)
    },
    enableStrategy({commit},order) {
        commit('ENABLE_STRATEGY',order)
    },
    searchMarketPairOrders({commit},order) {
        commit('SEARCH_MARKETPAIR_ORDERS',order)
    },
    searchOrderHistory({commit},order) {
        commit('SEARCH_ORDER_HISTORY', order)
    },
}

const mutations = {
    UPDATE_ORDER(state, orderList){
        if (orderList !== null && orderList !== undefined) {
            Object.freeze(orderList)
            for (var orderID in orderList) {
                var order = orderList[orderID]
                if (Object.keys(state.marketPairOrders).length == 0) {
                    state.marketPairOrders = {
                        [order.OrderID]: order
                    }
                } else {
                    state.marketPairOrders[order.OrderID] = order
                }
            }
            //sort state.marketPairOrders object by key
            state.marketPairOrders = Object.keys(state.marketPairOrders).sort().reduce(
                (obj, key) => {
                    obj[key] = state.marketPairOrders[key];
                    return obj;
                },
                {}
            )
            

            // if (Object.keys(state.marketPairOrders).length == 0) {
            //     state.marketPairOrders = {[order.OrderID]:order}
            // } else {
            //     state.marketPairOrders[order.OrderID] = order
            // }
        }
    },
    UPDATE_ORDER_HISTORY(state, orderHistoryList) {
        // if (Object.keys(state.orderHistory).length == 0) {
        //     state.orderHistory = {[order.OrderID]:order}
        // } else {
        //     state.orderHistory[order.OrderID] = order
        // }

        if (orderHistoryList !== null){
            state.orderHistory = orderHistoryList
            state.orderHistoryCount = Object.keys(state.orderHistory).length
        }

        // var idNum = 0;
        // Object.freeze(orderHistoryList)
        // for (var orderID in orderHistoryList) {
        //     var order = orderHistoryList[orderID]
        //     if (Object.keys(state.orderHistory).length == 0) {
        //         state.orderHistory = {
        //             [idNum]: order
        //         }
        //     } else {
        //         state.orderHistory[idNum] = order
        //     }
        //     idNum++
        // }


    },
    CREATE_ORDER(state, order) {
        return true
        // if (order.Status ==  "disabled") {
        //     order.Status = "enabled"
        //     state.activeOrders = { [order.Pair]: order }
        // }
    },
    CANCEL_ORDER(state, order) {
        return true
        // if (order.Status == "enabled") {
        //     order.Status = "disabled"
        //     delete state.activeOrders[order.Pair]
        // }
    },
    SEARCH_ORDER_HISTORY(state, symbol) {
        state.orderHistory = []
        state.orderHistoryCount = 0
        return true
    },
    SEARCH_MARKETPAIR_ORDERS(state, symbol) {
        state.marketPairOrders = []
        return true
    },
    DISABLE_STRATEGY(state, symbol) {
        return true
    },
    ENABLE_STRATEGY(state, symbol) {
        return true
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}