// const wsConnAsset = new WebSocket('ws://localhost:8181/ws/assets')
// const wsConnAsset = new WebSocket('wss://backpocket.eplaza.cloud/ws/assets')


var wsConnAsset;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/ws/assets"

// const wsConnAsset = new WebSocket('ws://ws/assets')

export default function createWebSocketPlugin() {
    return store => {

        var heartBeat = function(){
            if (!wsConnAsset) return;
            if (wsConnAsset.readyState !== 1) return;
            wsConnAsset.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function () {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

            wsConnAsset = new WebSocket(wsURL)
            wsConnAsset.onclose = function (event) {
                console.log('Assets Connection closed')
                wsConnAsset = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnAsset.onopen = function (event) {
                heartBeat()
            }

            wsConnAsset.onmessage = function (event) {
                wsReconnect = 0
                var wsResponse = JSON.parse(event.data)
                if (event.data !== null && event.data !== undefined) {
                    switch(wsResponse.Action){
                        case "searchresult":
                            store.dispatch('assets/updateSearch', Object.freeze(wsResponse.Result));
                        break;
                        default: 
                            // for (var asset in wsResponse.Result) {
                            //     store.dispatch('assets/addAsset', Object.freeze(wsResponse.Result[asset]));
                            // }
                            store.dispatch('assets/addAsset', Object.freeze(wsResponse.Result));
                        break
                    }
                } 
            }
            wsReconnect++
            
        }
        setupWebSocket()

        store.subscribe((action, state) => {
            switch (action.type) {
                case "assets/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;

                case "assets/SEARCH_ASSETS":
                    if (wsConnAsset == null) {
                        setupWebSocket()
                    }
                    wsConnAsset.send(JSON.stringify(action.payload))
                    break;
            }
        })

    };
}
