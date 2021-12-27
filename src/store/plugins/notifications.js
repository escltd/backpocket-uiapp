

var wsConnNotification;
var wsReconnect = 0;
var wsURL = ((window.location.protocol === "https:") ? "wss:" : "ws:") + "//" + window.location.host + "/ws/notifications"

// const wsConnNotification = new WebSocket('ws://ws/notifications')

export default function createWebSocketPlugin() {
    return store => {

        var heartBeat = function(){
            if (!wsConnNotification) return;
            if (wsConnNotification.readyState !== 1) return;
            wsConnNotification.send(`{}`);
            setTimeout(heartBeat, 30000);
        }

        var setupWebSocket = function () {
            if (wsReconnect > 3) {
                console.log('Stopping all connections')
                return
            }

            wsConnNotification = new WebSocket(wsURL)
            console.log('Openning notifications connection')

            wsConnNotification.onclose = function (event) {
                console.log('Notifications Connection closed')
                wsConnNotification = null
                setTimeout(setupWebSocket, 1500);
            }

            wsConnNotification.onopen = function (event) {
                heartBeat()
            }
            
            wsConnNotification.onmessage = function (event) {
                wsReconnect = 0
                var notification = JSON.parse(event.data)
                Object.freeze(notification);
                store.dispatch('notifications/addNotification', notification);
            }
            wsReconnect++
        }
        setupWebSocket()

        store.subscribe((mutation, state) => {
            switch (mutation.type) {
                case "notifications/CONNECT_WEBSOCKET":
                    wsReconnect = 0;
                    setupWebSocket();
                    break;
            }
        })
    };
}
