const samplePair = {
    Pair: "",
    Exchange: "***",
    BaseAsset: "***",
    QuoteAsset: "***",
    TickSize: 0,
    StepSize: 0,
    Price: 0,
    Volume: 0,
    FirstAsk: 0.0,
    FirstBid: 0.0,
    NumOfTrades: 0,
    VolumeQuote: 0,
    Low: 0,
    Open: 0,
    High: 0,
    Close: 0,
    LastBid: 0,
    LastAsk: 0,
    BidPrice: 0,
    AskPrice: 0,
    FirstBid: 0,
    FirstAsk: 0,
    SecondAsk: 0,
    SecondBid: 0,
    PriceChangePercent: 0,
}


const state = {
    enabledMarketPairs: {}, allMarketPairs: {}, 
    marketPair: samplePair, marketCount:0,
    defaultpair: localStorage.getItem("defaultpair"),
}


const getters = {
    getMarketPair: state => state.marketPair,
    getAllMarketPairs: state => state.allMarketPairs,
    getEnabledMarketPairs: state => state.enabledMarketPairs,
}

const actions = {
    connectWebsocket({commit } ) {
        commit('CONNECT_WEBSOCKET')
    },
    setDefaultMarketPair({commit }, marketPair ) {
        commit('SET_DEFAULTMARKETPAIR', marketPair)
    },
    updateMarketPair({commit }, marketPair ) {
        commit('UPDATE_MARKETPAIR', marketPair)
    },
    restartMarketPair({commit }, pair ) {
        commit('RESTART_MARKETPAIR', pair)
    },
    enableMarketPair({commit }, marketPair ) {
        commit('ENABLE_MARKETPAIR', marketPair)
    },
    disableMarketPair({commit }, marketPair ) {
        commit('DISABLE_MARKETPAIR', marketPair)
    },
}

const mutations = {

    CONNECT_WEBSOCKET(state) {
        return true
    },
    SET_DEFAULTMARKETPAIR(state, marketPair){
        state.marketPair = marketPair
        state.defaultpair = marketPair.Pair
        localStorage.setItem("defaultpair",state.defaultpair)
    },
    UPDATE_MARKETPAIR(state, marketPair){
        if (Object.keys(state.allMarketPairs).length == 0) {
            state.allMarketPairs = { [marketPair.Pair]: marketPair }
        } else {
            //capture new markets
            if (state.allMarketPairs[marketPair.Pair] == undefined || state.allMarketPairs[marketPair.Pair] == null) {
                state.allMarketPairs[marketPair.Pair] = marketPair
            } else { 
                state.allMarketPairs[marketPair.Pair] = marketPair
            }
        }

        if (marketPair.Status == "enabled") {
            if (Object.keys(state.enabledMarketPairs).length == 0) {
                state.enabledMarketPairs = { [marketPair.Pair]: marketPair }
            } else {
                state.enabledMarketPairs[marketPair.Pair] = marketPair
            }

            if (state.defaultpair == undefined || state.defaultpair == null || state.defaultpair == "") {
                state.defaultpair = marketPair.Pair
            }

            if (state.defaultpair == marketPair.Pair) {
                state.marketPair = marketPair
            }
        } else {
            delete state.enabledMarketPairs[marketPair.Pair]
        }
    },
    RESTART_MARKETPAIR(state, marketPair) {
        state.enabledMarketPairs = {} 
        state.allMarketPairs = {}
        return true
    },
    ENABLE_MARKETPAIR(state, marketPair) {
        marketPair.Status = "enabled"
        if (Object.keys(state.enabledMarketPairs).length == 0) {
            state.enabledMarketPairs = { [marketPair.Pair]: marketPair }
        } else {
            state.enabledMarketPairs[marketPair.Pair] = marketPair
        }
        state.allMarketPairs[marketPair.Pair] = marketPair

        state.marketPair = marketPair
        state.defaultpair = marketPair.Pair
        localStorage.setItem("defaultpair", state.defaultpair)
        return true
    },
    DISABLE_MARKETPAIR(state, marketPair) {
        marketPair.Status = "disabled"
        if (state.defaultpair == marketPair.Pair) {
            state.defaultpair = ""
            localStorage.setItem("defaultpair", state.defaultpair)
            delete state.enabledMarketPairs[state.defaultpair]
        }
        state.allMarketPairs[marketPair.Pair] = marketPair
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