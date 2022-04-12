// const wsConnOrder = new WebSocket('ws://localhost:8181/ws/orders')
// const wsConnOrder = new WebSocket('wss://backpocket.eplaza.cloud/ws/orders')

// const wsConnOrder = new WebSocket('ws://ws/orders')

var wsConnOrder;
var wsConnOrderHistory;
var wsReconnect = 0;
var wsReconnectHistory = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/ws/orders"
var wsURLHistory = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/ws/orderhistory"

export default function createWebSocketPlugin() {
    return store => {

        var heartBeat = function(){
            if (!wsConnOrder) return;
            if (wsConnOrder.readyState !== 1) return;
            wsConnOrder.send(`{"Pair":""}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function () {
            if (wsReconnect > 15) {
                console.log('Stopping all orders connections')
                return
            }
            
            wsConnOrder = new WebSocket(wsURL)
            console.log('Openning orders connection')

            wsConnOrder.onclose = function (event) {
                console.log('Orders Connection closed')
                wsConnOrder = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnOrder.onopen = function (event) {
                heartBeat()
            }

            wsConnOrder.onmessage = function (event) {
                wsReconnect = 0
                if (event.data !== null && event.data !== undefined) {
                    var order = JSON.parse(event.data)
                    store.dispatch('orders/updateOrder', order);
                }
            }
            wsReconnect++
        }

        var heartBeatHistory = function(){
            if (!wsConnOrderHistory) return;
            if (wsConnOrderHistory.readyState !== 1) return;
            wsConnOrderHistory.send(`{"Pair":""}`);
            setTimeout(heartBeatHistory, 30000);
        }


        var setupWebSocketHistory = function () {
            if (wsReconnectHistory > 5) {
                console.log('Stopping all order history connections')
                return
            }
            
            wsConnOrderHistory = new WebSocket(wsURLHistory)
            console.log('Openning orders connection')

            wsConnOrderHistory.onopen = function (event) {
                // wsConnOrderHistory.send(JSON.stringify({
                //     Pair: "|", Status: "FILLED",
                //     Created: new Date().toJSON().slice(0, 10),
                // }))
                heartBeatHistory()
            }

            wsConnOrderHistory.onclose = function (event) {
                console.log('Orders Connection closed')
                wsConnOrderHistory = null
                setTimeout(setupWebSocketHistory, 3500);
            }

            wsConnOrderHistory.onmessage = function (event) {
                wsReconnectHistory = 0
                if (event.data !== null && event.data !== undefined) {
                    var orderHistoryList = JSON.parse(event.data)
                    store.dispatch('orders/updateOrderHistory', orderHistoryList);
                }
            }
            wsReconnectHistory++
        }
        setupWebSocket()
        setupWebSocketHistory()

        store.subscribeAction((action, state) => {
            switch(action.type) {
                case "assets/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;

                case "orders/searchMarketPairOrders":
                    // var msgList = {Action:"list", Order:{Pair: action.payload }}
                    var msgList = action.payload
                    if (wsConnOrder == null) {
                        setupWebSocket()
                    }
                    wsConnOrder.send(JSON.stringify(msgList))
                    break;
                
                case "orders/searchOrderHistory":
                    var msgList = action.payload
                    if (wsConnOrderHistory == null) {
                        setupWebSocketHistory()
                    }
                    wsConnOrderHistory.send(JSON.stringify(msgList))
                    break;

                case "orders/createOrder":
                    var msgList = {Action:"create", Order: action.payload}
                    if (wsConnOrder == null) {
                        setupWebSocket()
                    }
                    wsConnOrder.send(JSON.stringify(msgList))
                    break;

                case "orders/cancelOrder":
                    var msgList = {Action:"cancel", Order: action.payload}
                    if (wsConnOrder == null) {
                        setupWebSocket()
                    }
                    wsConnOrder.send(JSON.stringify(msgList))
                    break;
                
                case "orders/enableStrategy":
                    var msgList = {Action:"refenable", Order: action.payload}
                    if (wsConnOrder == null) {
                        setupWebSocket()
                    }
                    wsConnOrder.send(JSON.stringify(msgList))
                    break;
                
                case "orders/disableStrategy":
                    var msgList = {Action:"refdisable", Order: action.payload}
                    if (wsConnOrder == null) {
                        setupWebSocket()
                    }
                    wsConnOrder.send(JSON.stringify(msgList))
                    break;
            }
        });

        /*
        store.subscribe((mutation, state) => {
            // called after every mutation.
            // The mutation comes in the format of `{ type, payload }`.
            switch (mutation.type) {
                case "orders/CREATE_ORDER":
                // console.log(mutation.payload.Status)
                wsConnOrder.send(JSON.stringify(mutation.payload))
                break;
            
                case "orders/CANCEL_ORDER":
                // console.log(mutation.payload.Status)
                wsConnOrder.send(JSON.stringify(mutation.payload))
                break;
            }
        })
        */

    };
}
