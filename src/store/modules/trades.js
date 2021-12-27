const state = {
    allTrades: [], tradeCount:0,
}


const getters = {
    getAllTrades: state => state.allTrades,
    getTradeCount: state => state.tradeCount,
}

const actions = {
    connectWebsocket({commit } ) {
        commit('CONNECT_WEBSOCKET')
    },
    disconnectWebsocket({commit } ) {
        commit('DISCONNECT_WEBSOCKET')
    },
    updateTrade({commit }, trade ) {
        commit('UPDATE_TRADE', trade)
    },
}

const mutations = {
    CONNECT_WEBSOCKET(state) {
        return true
    },
    DISCONNECT_WEBSOCKET(state) {
        return true
    },
    UPDATE_TRADE(state, trade){
        // if (Object.keys(state.allTrades).length == 0) {
        //     state.allTrades = { [trade.Pair+'-'+trade.Exchange]: [trade] }
        // } else {
        //     if (state.allTrades[trade.Pair + '-' + trade.Exchange] == undefined) {
        //         state.allTrades[trade.Pair + '-' + trade.Exchange] = []
        //     }
        //     state.allTrades[trade.Pair + '-' + trade.Exchange].push(trade)
        // }
        state.allTrades.push(trade)
        // state.tradeCount = Object.keys(state.allTrades).length
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}