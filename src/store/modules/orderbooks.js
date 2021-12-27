var sampleOrderBook = {
    Pair : "",
    BaseAsset: "***",
    QuoteAsset: "***",
    Exchange: "***",
    AsksTotal: 0,
    BidsTotal: 0,
    Asks: [{Price:0,Quantity:0,Total:0,Percentage:0}],
    Bids: [{Price:0,Quantity:0,Total:0,Percentage:0}]
}


const state = {
    defaultorderbook: localStorage.getItem("defaultorderbook"),
    allOrderBooks: {}, orderBook: sampleOrderBook, orderBookCount:0,
}


const getters = {
    getOrderBook: state => state.orderBook,
    orderBookCount: state => state.orderBookCount,
    getAllOrderBooks: state => state.allOrderBooks,
}

const actions = {
    connectWebsocket({commit } ) {
        commit('CONNECT_WEBSOCKET')
    },
    disconnectWebsocket({commit } ) {
        commit('DISCONNECT_WEBSOCKET')
    },
    setDefaultOrderBook({commit }, orderBook ) {
        commit('SET_DEFAULTORDERBOOK', orderBook)
    },
    updateOrderBook({commit }, orderBook ) {
        commit('UPDATE_ORDERBOOK', orderBook)
    },
}

const mutations = {
    CONNECT_WEBSOCKET(state) {
        return true
    },
    DISCONNECT_WEBSOCKET(state) {
        return true
    },
    SET_DEFAULTORDERBOOK(state, pairexchange){
        // state.orderBook.Asks = [{Price:0,Quantity:0}]
        // state.orderBook.Bids = [{Price:0,Quantity:0}]
        state.orderBook = state.sampleOrderBook
        state.defaultorderbook = pairexchange.Pair + '-' + pairexchange.Exchange
        localStorage.setItem("defaultorderbook",state.defaultorderbook)

        if (state.allOrderBooks[state.defaultorderbook] !== null && state.allOrderBooks[state.defaultorderbook] !== undefined) {
            state.orderBook = state.allOrderBooks[state.defaultorderbook]
        } else {
            state.orderBook = sampleOrderBook
        }
    },
    UPDATE_ORDERBOOK(state, orderBook){

        if (Object.keys(state.allOrderBooks).length == 0) {
            state.allOrderBooks = { [orderBook.Pair+'-'+orderBook.Exchange]: orderBook }
        } else {
            state.allOrderBooks[orderBook.Pair+'-'+orderBook.Exchange] = orderBook
        }

       

        if (state.defaultorderbook == undefined || state.defaultorderbook == null || state.defaultorderbook == "") {
            state.defaultorderbook = orderBook.Pair + '-' + orderBook.Exchange
        }

        if (state.defaultorderbook == orderBook.Pair + '-' + orderBook.Exchange) {
            state.orderBook = orderBook
        }

        state.orderBookCount = Object.keys(state.allOrderBooks).length
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}