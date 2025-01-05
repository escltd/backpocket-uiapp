var sma = {
  "Trend": "", "Support": 0,
  "Resistance": 0, "Spread": 0,
  "Entry": 0, "StopLoss": 0, "TakeProfit": 0
}

var interval = {
  "Timeframe": "", "Trend": "", "RSI": 0,
  "BollingerBands": { "lower": 0, "middle": 0, "upper": 0, },
  "Pattern": {"Candle": "", "Chart": "", },
  "SMA10": sma, "SMA20": sma, "SMA50": sma,
  "RetracementLevels": { "0.236": 0, "0.382": 0, "0.500": 0, "0.618": 0, "0.786": 0, }    
}

var sampleAnalysis = {
  "Pair": "",
  "Exchange": "",
  "Intervals" : {
    "1m": interval, "3m": interval, "5m": interval, "15m": interval,
    "30m": interval, "1h": interval, "2h": interval, "4h": interval,
    "1d": interval
  }
}

const state = {
  allAnalysis: { }, 
  analysis: sampleAnalysis, analysisCount:0,
  defaultpair: localStorage.getItem("defaultpair"),
}

const getters = {
  getAnalysis: state => state.analysis,
  getAllAnalysis: state => state.allAnalysis,
}

const actions = {
  connectWebsocket({commit } ) {
      commit('CONNECT_WEBSOCKET')
  },
  updateAnalysis({commit }, analysis ) {
      commit('UPDATE_ANALYSIS', analysis)
  },
}

const mutations = {
    CONNECT_WEBSOCKET(state) {
        return true
    },
    UPDATE_ANALYSIS(state, analysis){
      // if (Object.keys(state.allAnalysis).length == 0) {
      //   state.allAnalysis = { [analysis.Pair]: analysis }
      // } else {
          //capture new markets
          if (state.allAnalysis[analysis.Pair] == undefined || state.allAnalysis[analysis.Pair] == null) {
              state.allAnalysis[analysis.Pair] = analysis
          } else { 
            state.allAnalysis[analysis.Pair] = analysis
          }
      // }

      if (state.defaultpair == undefined || state.defaultpair == null || state.defaultpair == "") {
          state.defaultpair = analysis.Pair
      }

      if (state.defaultpair == analysis.Pair) {
        state.analysis = analysis
      }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}