// const wsConnOrderBook = new WebSocket('ws://localhost:8181/ws/orderBooks')
// const wsConnOrderBook = new WebSocket('wss://backpocket.eplaza.cloud/ws/orderBooks')
// const wsConnOrderBook = new WebSocket('ws://ws/orderBooks')

var wsConnOrderBook;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/ws/orderbooks"

export default function createWebSocketPlugin() {
    return store => {
        
        var heartBeat = function(){
            if (!wsConnOrderBook) return;
            if (wsConnOrderBook.readyState !== 1) return;
            wsConnOrderBook.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function() {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

           wsConnOrderBook = new WebSocket(wsURL)
            console.log('Openning orderBooks connection')

            wsConnOrderBook.onclose = function (event) {
                console.log('OrderBook Connection closed')
                wsConnOrderBook = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnOrderBook.onopen = function (event) {
                heartBeat()
            }

            wsConnOrderBook.onmessage = function (event) {
                wsReconnect = 0
                var orderBook = JSON.parse(event.data)
                if (orderBook.Bids == null) {
                    orderBook.Bids = []
                }
                
                if (orderBook.Asks == null) {
                    orderBook.Asks = []
                }

                if (orderBook.BaseAsset !== "" && orderBook.QuoteAsset !== "" && !orderBook.Pair.includes("DOWN") && !orderBook.Pair.includes("UP")) {
                    Object.freeze(orderBook)
                    store.dispatch('orderbooks/updateOrderBook', orderBook);
                }
            }
            wsReconnect++
        }
        setupWebSocket()

        store.subscribe((action, state) => {
            // called after every action.
            // The action comes in the format of `{ type, payload }`.
            switch (action.type) {
                case "orderbooks/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;
                    
                case "orderbooks/DISCONNECT_WEBSOCKET":
                    wsReconnect = 10;
                    wsConnOrderBook.close();
                    break;
            }
        })

        
    };
}
