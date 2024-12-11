// const wsConnMarket = new WebSocket('ws://localhost:8181/websocket/markets')
// const wsConnMarket = new WebSocket('wss://backpocket.eplaza.cloud/websocket/markets')
// const wsConnMarket = new WebSocket('ws://websocket/markets')

var wsConnMarket;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/websocket/markets"

  
export default function createWebSocketPlugin() {
    return store => {
        
        var heartBeat = function(){
            if (!wsConnMarket) return;
            if (wsConnMarket.readyState !== 1) return;
            wsConnMarket.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function() {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

            wsConnMarket = new WebSocket(wsURL)
            console.log('Openning markets connection')

            wsConnMarket.onclose = function (event) {
                console.log('Market Pairs Connection closed')
                wsConnMarket = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnMarket.onopen = function (event) {
                heartBeat()
            }

            wsConnMarket.onmessage = function (event) {
                wsReconnect = 0
                var market = JSON.parse(event.data)
                // if (market.Pair === "LUNCUSDT") {
                //     console.error(market)
                // }
                // Object.freeze(market)
                if (market.BaseAsset !== "" && market.QuoteAsset !== "" && !market.Pair.includes("DOWN") && !market.Pair.includes("UP")) {
                    store.dispatch('marketpairs/updateMarketPair', market);
                }
            }
            wsReconnect++
            
        }   
        setupWebSocket()

        store.subscribe((action, state) => {
            // called after every action.
            // The action comes in the format of `{ type, payload }`.
            switch (action.type) {
                case "marketpairs/CONNECT_WEBSOCKET":
                wsReconnect = 0;
                setupWebSocket();
                break;

                case "marketpairs/RESTART_MARKETPAIR":
                var msgList = {Action:"restart", Pair: ""}
                wsConnMarket.send(JSON.stringify(msgList))
                break;
               
                case "marketpairs/ENABLE_MARKETPAIR":
                var msgList = {
                    Action: "enable",
                    Pair: action.payload.Pair,
                    Exchange: action.payload.Exchange
                }
                wsConnMarket.send(JSON.stringify(msgList))
                break;
            
                case "marketpairs/DISABLE_MARKETPAIR":
                var msgList = {
                    Action:"disable", 
                    Pair: action.payload.Pair,
                    Exchange: action.payload.Exchange
                    }
                wsConnMarket.send(JSON.stringify(msgList))
                break;
            }
        })

        
    };
}
