
const state = {
    assetsList: {}, searchCount: 0, searchList: [],
    defaultAsset: {Symbol:"", Free:0, Locked:0},
    defaultsymbol: localStorage.getItem("defaultsymbol"),
}

const getters = {
    getAssetsList: state => state.assetsList,
    getSearchList: state => state.searchList,
    getSearchCount: state => state.searchCount,
    getDefaultAsset: state => state.defaultAsset,
}

const actions = {
    connectWebsocket({commit } ) {
        commit('CONNECT_WEBSOCKET')
    },
    addAsset({commit }, asset ) {
        commit('ADD_ASSET', asset)
    },
    setDefaultAsset({commit }, asset ) {
        commit('SET_ASSET', asset)
    },
    searchAssets({commit}, search ) {
        commit('SEARCH_ASSETS', search)
    },
    updateSearch({commit},searchList) {
        commit('UPDATE_SEARCH', searchList)
    },
}

const mutations = {
    CONNECT_WEBSOCKET(state) {
        return true
    },
    ADD_ASSET(state, assetList) {
        if (assetList !== null && assetList !== undefined) {
            Object.freeze(assetList)
            for (var assetID in assetList) {
                var asset = assetList[assetID]
                if (Object.keys(state.assetsList).length == 0) {
                    state.assetsList = { [asset.Symbol]: asset }
                } else {
                    state.assetsList[asset.Symbol] = asset
                }

                if (state.defaultsymbol == undefined || state.defaultsymbol == null || state.defaultsymbol == "") {
                    state.defaultsymbol = asset.Symbol
                    state.defaultAsset = asset
                }

                if (state.defaultsymbol == asset.Symbol) {
                    state.defaultAsset = asset
                }

                if (state.defaultAsset.Symbol == "" && asset.Free > 0) {
                state.defaultsymbol = asset.Symbol
                state.defaultAsset = asset
                }
            }
        }
    },
    SET_ASSET(state, asset) {
        state.defaultAsset = asset
        state.defaultsymbol = asset.Symbol
        localStorage.setItem("defaultsymbol", asset.Symbol)
    },
    UPDATE_SEARCH(state, searchList) {
        if (searchList !== null && searchList !== undefined) {
            state.searchList = searchList
            state.searchCount = Object.keys(state.searchList).length
        }
    },
    SEARCH_ASSETS(state, symbol) {
        state.searchList = {}
        state.searchCount = 0
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