<template>
    <div class="inline-flex flex-column w-100 overflow-y-scroll br4 bt bb b--black-10" style="height:19rem">
        <div style="" :class="{'bg-light-gray':order.Status=='NEW'}" class="w-100 tl flex bb bl br b--black-05 near-black" v-for="(order, index) in listMarketOrders()" :key="index">
            <div class="pa1 w-25-ns w-30 br b--black-10 pa1 pointer tl" @click="cancelOrder(order)"> 
                <small class="tl w-100 pt1">
                    <i class="fa fa-check pointer" :class="{'dark-red':order.Status=='CANCELED', 'gold':order.Status=='NEW', 'dark-green':order.Status=='TRADE'||order.Status=='FILLED'}"/>
                    <span class="fr"> {{humanDate(order.Created.substring(0,19)).substring(15,30)}} </span>
                    <span class="fl w-100 tr">
                        {{humanDate(order.Created.substring(0,19)).substring(0,11)}}
                        <small>{{humanDate(order.Created.substring(0,19)).substring(11,15)}}</small>
                    </span>
                    <span class="fl w-100 tr pt1 i">
                        <i v-if="order.Status=='NEW'||order.Status=='PARTIALLY_FILLED'" class="fa fa-times dark-red pointer" /> 
                        <small>ID:</small> {{order.OrderID}}
                    </span>
                </small>
            </div> 
            <div class="w-75-ns w-70 pa1"> 
                <small class="w-100 fl">
                    {{order.Side}} {{market.BaseAsset}}  @ <b>{{humanNumber(truncateNumber(order.Price))}}</b> 
                    <span :class="{'black-10':order.RefEnabled!==1||order.RefFilled!=='','dark-gray':order.RefTripped == ''&&order.RefEnabled==1,'green':order.RefTripped !== ''&&order.RefEnabled==1}" v-if="order.AutoRepeat>0">
                        <i class="fa fa-repeat"/> x{{order.AutoRepeat}}
                    </span>
                    
                    <span class="fr ">
                        <span>&nbsp;
                            <span v-if="order.Side=='BUY'" :class="{'green':order.PnL>0,'gray':order.PnL<0,}">&nbsp;{{truncateNumber(order.PnL)}}</span>
                            <span v-else :class="{'green':order.PnL>0,'red':order.PnL<0,}">{{truncateNumber(order.PnL)}}</span>
                        </span>
                        <small> {{market.QuoteAsset}}&nbsp;</small> 
                    </span>
                </small>
                
                <small class="w-100 fl pv1">
                    <span class="fl">
                        <span v-if="order.Side=='BUY'" class="pointer"> 
                            <span @click="updateSellQty(order.Quantity)">{{humanNumber(truncateNumber(order.Quantity))}}</span> &nbsp;=&nbsp; <span @click="updateSellAmount(order.Total)">{{humanNumber(truncateNumber(order.Total))}}</span>
                        </span> 
                        <span v-else class="pointer">
                            <span @click="updateBuyQty(order.Quantity)"> {{humanNumber(truncateNumber(order.Quantity))}} </span> &nbsp;=&nbsp; <span @click="updateBuyAmount(order.Total)"> {{humanNumber(truncateNumber(order.Total))}} </span>
                        </span>
                    </span>

                    <span class="fr">
                        <span>&nbsp;{{truncateNumber(order.Fees)}} </span> <small>FEE&nbsp;</small>
                    </span>
                </small>
                
                <small class="w-100 fl">
                    <span class="flex w-100">
                        <span class="fl w-80" v-if="order.Stoploss>0||order.Takeprofit>0">
                            <span class="i flex w-100 items-center" v-if="order.RefTripped == ''" :class="{'dark-gray':order.RefEnabled==1,'black-50':order.RefEnabled!==1}">
                                <span v-if="order.Side=='BUY'">
                                    <span class="pr1 tl" v-if="order.Takeprofit>0" :class="{'green':order.RefTripped == 'takeprofit'}">
                                        {{order.Takeprofit}}% TP: {{ truncateNumber(((100+order.Takeprofit)/100)*order.Price) }}
                                    </span>
                                    <span class="pr1 tl" v-if="order.Stoploss>0" :class="{'green':order.RefTripped == 'stoploss'}">
                                        {{order.Stoploss}}% SL: {{ truncateNumber(((100-order.Stoploss)/100)*order.Price) }}
                                    </span>  
                                </span>  
                                <span v-else>
                                    <span class="pr1 tl" v-if="order.Takeprofit>0" :class="{'green':order.RefTripped == 'takeprofit'}">
                                        {{order.Takeprofit}}% TP: {{ truncateNumber(((100-order.Takeprofit)/100)*order.Price) }}
                                    </span>
                                    <span class="pr1 tl" v-if="order.Stoploss>0" :class="{'green':order.RefTripped == 'stoploss'}">
                                        {{order.Stoploss}}% SL: {{ truncateNumber(((100+order.Stoploss)/100)*order.Price) }}
                                    </span>  
                                </span>

                        
                                <span v-if="order.RefEnabled==1" class="tc pointer fr pr2" @click="disableStrategy(order)">
                                    <i class="fa fa-times red"/>
                                </span>
                                <span v-else class="tc pointer fr pr2" @click="enableStrategy(order)">
                                    <i class="fa fa-check black-50"/>
                                </span>
                            </span>
                            <span v-else class="tl w-100" :class="{'green':order.RefTripped.includes('TP'),'light-green':order.RefTripped.includes('SL')}">
                                {{order.RefTripped}}
                            </span>
                        </span>
                        <span class="fl w-30 tr" v-if="order.RefOrderID>0">
                            <small>Ref ID:</small> {{order.RefOrderID}}
                            <span v-if="order.AutoRepeatID>0">
                                <small> &lt;-&gt; Prev ID:</small> {{order.AutoRepeatID}}
                            </span>
                        </span>
                        
                    </span>
                </small>

                <small class="w-100 fl tl bg-blue white">
                    <small>
                    &nbsp;DCA: &nbsp;{{humanNumber(truncateNumber(order.TotalBase))}} = {{humanNumber(truncateNumber(order.TotalQuote))}} @ {{order.AveragePrice}}
                    </small>
                </small>
            </div> 
            
        </div>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { calculateOrderPnL} from "@/calculatePNL"
    import { humanNumber, humanDate, truncateNumber, sortObjectEntries } from "@/common"

    export default {
        props: ["market"],
        computed: {
            ...mapGetters('orders', ['getMarketPairOrders']),
        },
        data() { return { }},
        created() {},
        methods: {
            humanDate,
            humanNumber,
            truncateNumber,
            calculateOrderPnL,
            updateBuyQty(qty){
                this.$emit('updateBuyQty', qty);
            },
            updateBuyAmount(amount){
                this.$emit('updateBuyAmount', amount);
            },
            updateBuyPrice(price){
                this.$emit('updateBuyPrice', price);
            },
            updateSellQty(qty){
                this.$emit('updateSellQty', qty);
            },
            updateSellAmount(amount){
                this.$emit('updateSellAmount', amount);
            },
            updateSellPrice(price){
                this.$emit('updateSellPrice', price);
            },
            
            disableStrategy(order){
                if (order.Status == "FILLED" || order.Status == "NEW" ) {
                    this.$store.dispatch('orders/disableStrategy', order)
                    this.$parent.notifications = ["Order ID: "+order.OrderID+" strategy disabled"]
                    setTimeout(this.$parent.closeNotification, 750);
                }
            },
            enableStrategy(order){
                if (order.Status == "FILLED" || order.Status == "NEW") {
                    this.$store.dispatch('orders/enableStrategy', order)
                    this.$parent.notifications = ["Order ID: "+order.OrderID+" strategy enabled"]
                    setTimeout(this.$parent.closeNotification, 750);
                }
            },
            cancelOrder(order){
                if (order.Status == "NEW" || order.Status == "PARTIALLY_FILLED") {
                    this.$store.dispatch('orders/cancelOrder', order)
                    // this.$parent.notifications = ["Order ID: "+order.OrderID+" cancel request submitted"]
                    // setTimeout(this.$parent.closeNotification, 750);
                }
            },
            searchOrders() {
                this.$store.dispatch('orders/searchMarketPairOrders', this.market.Pair)             
            },
            listMarketOrders() {

                var marketPairPNL = this.calculateOrderPnL(this.market.Pair, this.getMarketPairOrders)
                
                this.$parent.totalPnL = marketPairPNL.TotalPnL
                this.$parent.totalFees = marketPairPNL.TotalFees
                this.$parent.totalBase = marketPairPNL.TotalBase
                this.$parent.totalQuote = marketPairPNL.TotalQuote
                this.$parent.averagePrice = marketPairPNL.AveragePrice

                return marketPairPNL.OrderList 
            },
        },
        components: { },
        beforeMount() { },
        beforeDestroy() { },
    };
</script>
