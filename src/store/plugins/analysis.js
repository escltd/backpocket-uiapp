
var wsConnAnalysis;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/websocket/analysis"

export default function createWebSocketPlugin() {
    return store => {

        var heartBeat = function(){
            if (!wsConnAnalysis) return;
            if (wsConnAnalysis.readyState !== 1) return;
            wsConnAnalysis.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function() {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

           wsConnAnalysis = new WebSocket(wsURL)
            console.log('Openning analysis connection')

            wsConnAnalysis.onclose = function (event) {
                console.log('Analysis Connection closed')
                wsConnAnalysis = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnAnalysis.onopen = function (event) {
                heartBeat()
            }

            wsConnAnalysis.onmessage = function (event) {
                wsReconnect = 0
                try {
                  var analysis = JSON.parse(event.data)
                  store.dispatch('analysis/updateAnalysis', analysis);
                } catch(error) {
                    console.log('Error parsing data: ', error, event.data)
                    return
                }
            }
            wsReconnect++
        }
        setupWebSocket()

        store.subscribe((action, state) => {
            // called after every action.
            // The action comes in the format of `{ type, payload }`.
            switch (action.type) {
                case "analysis/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;
            }
        })

        
    };
}
