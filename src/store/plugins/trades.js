// const wsConnTrade = new WebSocket('ws://localhost:8181/websocket/trades')
// const wsConnTrade = new WebSocket('wss://backpocket.eplaza.cloud/websocket/trades')
// const wsConnTrade = new WebSocket('ws://websocket/trades')

var wsConnTrade;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/websocket/trades"

export default function createWebSocketPlugin() {
    return store => {

        var heartBeat = function(){
            if (!wsConnTrade) return;
            if (wsConnTrade.readyState !== 1) return;
            wsConnTrade.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function() {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

           wsConnTrade = new WebSocket(wsURL)
            console.log('Openning trades connection')

            wsConnTrade.onclose = function (event) {
                console.log('Trade Connection closed')
                wsConnTrade = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnTrade.onopen = function (event) {
                heartBeat()
            }

            wsConnTrade.onmessage = function (event) {
                wsReconnect = 0
                var trade = JSON.parse(event.data)
                Object.freeze(trade)
                if (trade.BaseAsset !== "" && trade.QuoteAsset !== "" && !trade.Pair.includes("DOWN") && !trade.Pair.includes("UP")) {
                    store.dispatch('trades/updateTrade', trade);
                }
            }
            wsReconnect++
        }   
        // setupWebSocket()

        store.subscribe((action, state) => {
            // called after every action.
            // The action comes in the format of `{ type, payload }`.
            switch (action.type) {
                case "trades/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;
                    
                case "trades/DISCONNECT_WEBSOCKET":
                    wsReconnect = 10;
                    wsConnTrade.close();
                    break;
            }
        })

        
    };
}
