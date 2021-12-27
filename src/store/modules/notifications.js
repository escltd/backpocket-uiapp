const state = {
    notificationsList: [],
}

const getters = {
    getNotificationsList: state => state.notificationsList,
}

const actions = {
    connectWebsocket({commit } ) {
        commit('CONNECT_WEBSOCKET')
    },
    addNotification({commit }, notification ) {
        commit('ADD_NOTIFICATION', notification)
    },
    delNotification({commit }, index ) {
        commit('DEL_NOTIFICATION', index)
    },
    clrNotifications({commit }) {
        commit('CLR_NOTIFICATION')
    },
}

const mutations = {
    CONNECT_WEBSOCKET(state) {
        return true
    },
    ADD_NOTIFICATION(state, notification) {
        state.notificationsList.push(notification)
    },
    DEL_NOTIFICATION(state, index) {
        state.notificationsList.splice(index, 1);
    },
    CLR_NOTIFICATION(state, index) {
        state.notificationsList = [];
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}