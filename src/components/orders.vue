<template>
  <section class="flex flex-column w-100 vh-100">
    <siteheader page="orders" />
        
    <div :key="getOrderHistoryCount" class="cf w-100 h-100 overflow-scroll">
        <div class="ph4-l ph2 cf mw8 center">
            <div class="fl w-100 f5 fw6 tr ">
                <div class="w-auto fl">
                    Order History
                </div>

                <div :key="totalPnLSell" class="w-auto fr">
                    <span v-if="totalPnLSell!==0"  class="ml2 fr br2 pointer tracked washed-yellow items-end tr"> 
                        <small class="f7 db w-100"> <small> {{baseAsset}}/{{quoteAsset}} PNL </small></small>
                        <span class="db w-100">  
                            <span :class="{'red':(totalPnLSell-totalFeesSell) < 0,'green':(totalPnLSell-totalFeesSell) > 0}"> 
                                {{truncateNumber(totalPnLSell-totalFeesSell)}} 
                            </span>
                            <small class="f7">
                                <small>{{quoteAsset}}</small>
                            </small>
                        </span> 
                    </span>
                </div>
            </div>
            
            <div class="flex flex-wrap w-100">
                <div class="pv2 ph1 flex flex-column">
                    <label class="fl pb1 f7">Date</label>
                    <div class="flex">
                        <span class="w-100 flex items-center">
                            <input class="w4 pa2 pb1 f7 fw6 bn br2 bg-white-10 white-70" type="date" v-model="startDate" />
                        </span>
                        <span class="ml2 w-100 flex items-center">
                            <input class="w4 pa2 pb1 f7 fw6 bn br2 bg-white-10 white-70" type="date" v-model="stopDate" />
                        </span>
                    </div>
                </div>
                <div class="pv2 ph1 flex flex-column">
                    <label class="fl pb1 f7">Status</label>
                    <select class="fl f7 pv2 fw6 bn br2 pl1 bg-white-10 white-70" v-model="orderStatus">
                        <option value="">ALL</option>
                        <option>NEW</option>
                        <option>FILLED</option>
                        <option>CANCELED</option>
                        <option>PARTIALLY_FILLED</option>
                    </select>
                </div>
                <div class="pv2 ph1 flex flex-column">
                    <label class="fl pb1 f7">Pair</label>
                    <span class="w-100 flex items-center">
                        <select class="w3 f7 pv2 fw6 bn br2 pl1 bg-white-10 white-70" v-model="baseAsset">
                            <option value="">ALL</option>
                            <option class="bg-background" v-for="(assetSymbol, idKey) in getTradedAssets()" :key="idKey">
                                {{assetSymbol}}
                            </option>
                            <option value="">- - - -</option>
                            <option class="bg-background" v-for="(assetSymbol, idKey) in getNotTradedAssets()" :key="getTradedAssets().length+idKey">
                                {{assetSymbol}}
                            </option>
                        </select>
                        <span class="ph1">-</span>
                        <select class="w3 f7 pv2 fw6 bn br2 pl1 bg-white-10 white-70" v-model="quoteAsset">
                            <option value="">ALL</option>
                            <option class="bg-background" v-for="(assetSymbol, idKey) in getTradedAssets()" :key="idKey">
                                {{assetSymbol}}
                            </option>
                            <option value="">- - - -</option>
                            <option class="bg-background" v-for="(assetSymbol, idKey) in getNotTradedAssets()" :key="getTradedAssets().length+idKey">
                                {{assetSymbol}}
                            </option>
                        </select>
                    </span>

                </div>
                <div class="pv2 ph1 flex flex-column">
                    <label class="fl pb1 f7">Side</label>
                    <select class="fl f7 pv2 fw6 bn br2 pl1 bg-white-10 white-70" v-model="orderSide">
                        <option value="">ALL</option>
                        <option>BUY</option>
                        <option>SELL</option>
                    </select>
                </div>
                <div class=" pv2 pl2 ph1 flex flex-column">
                    <label class="fl pb1 f6">&nbsp;</label>
                    <span @click="searchOrders" class="br2 pv1 pointer ph2 bg-light-yellow dark-gray flex items-center f5"> 
                        <i class="fa fa-search f7"/> search
                    </span>
                </div>
            </div>
        </div>

        
        <div class="mw8 cf center w-100 ph4-l ph2 f7 pb2">
            <p class="mv0 tr w-100 fl"> {{getOrderHistoryCount}} Records Found </p>
            <div class="flex flex-row w-100 fl br3 br--left br--right bg-white-10">
                <div class="tc pv2 w2 br bl b--white-10">#</div>
                <div class="tl pa2 w-20-ns w-40 br bl b--white-10">Date</div>
                
                <div class="tl pa2 w4-l w-20 br b--white-10 dn dib-ns">Pair</div>
                <div class="tr pa2 w3-l w-10 br b--white-10 dn dib-ns">Side</div>

                <div class="tc pa2 w-30-ns w-50 br b--white-10 dn-l">Pricing and Fees</div>
                <div class="tr pa2 w-10 br b--white-10 dn dib-l">Price</div>
                <div class="tr pa2 w-20 br b--white-10 dn dib-l">Total</div>
                <div class="tr pa2 w-10 br b--white-10 dn dib-l">Fee</div>
                <div class="tr pa2 w-10 br b--white-10 dn dib-l">PnL</div>


                <div class="tr pa2 w4-ns w-20 br b--white-10">Status</div>
                <div class="tr pa2 w-20 br b--white-10 dn dib-ns">Trigger</div>
            </div>
            <div  class="inline-flex flex-column w-100 fl br bl bb b--white-10 vh-50 overflow-scroll">
                <div style="min-height:3rem" class="flex flex-row items-start w-100 bb b--white-10" v-for="(order, index) in searchOrderHistory()" :key="index">
                    
                    <div class="tc pv2 w2 b--white-10 white "> 
                        {{index+1}}
                    </div>
                    <div class="tl pa2 w-20-ns w-40 white "> 
                        <small>
                            <span class="tl db-ns dn">
                                {{humanDate(order.Created.substring(0,19)).substring(0,11)}}
                                <small>{{humanDate(order.Created.substring(0,19)).substring(11,15)}}</small>
                                <small class="db w-100">
                                <span > {{humanDate(order.Created.substring(0,19)).substring(15,30)}} </span>
                                <span class="light-yellow">ID: {{order.OrderID}}</span> </small>
                            </span>
                            <small class="tl db dn-ns">
                                {{humanDate(order.Created.substring(0,19)).substring(0,11)}}
                                <small>{{humanDate(order.Created.substring(0,19)).substring(11,15)}}</small>
                                <small class="db w-100">
                                <span > {{humanDate(order.Created.substring(0,19)).substring(15,30)}} </span>
                                <span class="light-yellow">ID: {{order.OrderID}}</span> </small>
                            </small>
                            <span class="tr db w-100 dn-ns">
                                <small class="db">{{order.Pair}}</small> {{order.Side}}
                            </span>
                        </small>
                    </div>

                    <div class="tl pa2 w4-l w-20 dn dib-ns">
                        {{order.Pair}}
                    </div>
                    <div class="tr pa2 w3-l w-10  dn dib-ns">
                        {{order.Side}}
                    </div>
                    
                    <div class="tr pa2 w-30-ns w-50 dn-l">
                        <small class="">Price: {{truncateNumber(order.Price)}} <br/>
                        Total: {{truncateNumber(order.Quantity)}} = {{truncateNumber(order.Total)}} <br/>
                        Fee: {{truncateNumber(order.Fees)}} <br/>
                        PnL: {{truncateNumber(order.PnL)}} </small>
                    </div>
                    <div class="tr pa2 w-10 dn dib-l"><small> {{truncateNumber(order.Price)}}</small></div>
                    <div class="tr pa2 w-20 dn dib-l"><small> {{truncateNumber(order.Quantity)}} = {{truncateNumber(order.Total)}}</small></div>
                    <div class="tr pa2 w-10 dn dib-l"><small> {{truncateNumber(order.Fees)}}</small></div>
                    <div class="tr pa2 w-10 dn dib-l"><small :class="{'red':order.PnL < 0,'green':order.PnL > 0,}"> {{truncateNumber(order.PnL)}}</small></div>

                    <div class="tr pa2 w4-ns w-20 "> 
                        <small class="ttl pa1 br2" 
                            :class="{'bg-light-yellow dark-gray':order.Status=='NEW',
                            'bg-red':order.Status=='CANCELED','bg-green':order.Status=='FILLED',
                            'bg-light-green dark-gray':order.Status=='PARTIALLY_FILLED',}">
                            {{order.Status}}
                        </small> 
                    </div>
                    <div class="tr pa2 pb0 pt1 w-20  dn dib-ns"> <small class="db w-100"> {{order.RefFilled}}</small>
                        
                        <small class="light-yellow" v-if="order.RefOrderID>0">Ref ID: {{order.RefOrderID}} </small>
                    
                    </div>
                </div>
            </div>
        </div>
    </div>

  </section>
</template>

<script type="text/javascript">
import { mapState, mapGetters } from 'vuex';
import { calculateOrderPnL} from "@/calculatePNL"
import { HTTP, humanNumber, humanDate, truncateNumber, sortObjectEntries } from "@/common";
import marketpairs from "@/components/marketpairs";
import siteheader from "@/components/generic/siteheader";


export default {
    components: { siteheader, marketpairs, },
    data() { return {
        wsConnMarket:{}, lLoading: true, notifications: [], marketpairList: {},
        startDate: new Date().toJSON().slice(0,10), stopDate: new Date().toJSON().slice(0,10),
        baseAsset:"", quoteAsset: "", orderStatus: "FILLED", orderSide: "", 
        marketPairPnL:{}, 

        totalPnLBuy:0, totalFeesBuy:0, totalPnLSell:0, totalFeesSell:0, lastBuyPrice:0, lastSellPrice:0,
    }},
    computed: {
        ...mapGetters('orders', ['getOrderHistory','getOrderHistoryCount']),
        ...mapGetters('marketpairs', ['getAllMarketPairs']),
    },
    watch: {
        // whenever market changes, this function will run
        getOrderHistoryCount: function (newCount, oldCount) {
            if (newCount == 0) {
                
            }
        }
    },
    mounted() {
        const today = new Date()
        const stopDate = new Date()
        const startDate = new Date()

        startDate.setDate(today.getDate()-3)
        this.startDate = startDate.toJSON().slice(0,10)

        stopDate.setDate(today.getDate()+1)
        this.stopDate = stopDate.toJSON().slice(0,10)

        setTimeout(this.searchOrders, 750)
    },
    methods: {
        humanDate,
        humanNumber,
        truncateNumber,
        sortObjectEntries,
        calculateOrderPnL,
        keyUp(event) {
            if (event.code == "Enter") {
                // this.loadOrders()
            }
        },

        getTradedAssets() {
            var tradedAssetsObject = {}
            for ( var pair in this.getAllMarketPairs) {
                if(this.getAllMarketPairs[pair].Status==="enabled") {
                     if (Object.keys(tradedAssetsObject).length == 0) {
                         tradedAssetsObject = { [this.getAllMarketPairs[pair].BaseAsset]: true }
                         tradedAssetsObject[this.getAllMarketPairs[pair].QuoteAsset] = true
                     } else {
                         tradedAssetsObject[this.getAllMarketPairs[pair].BaseAsset] = true
                         tradedAssetsObject[this.getAllMarketPairs[pair].QuoteAsset] = true
                     }
                }
            }

            var tradedAssetsList = []
            for (var symbol in tradedAssetsObject) {
                tradedAssetsList.push(symbol)
            }
            tradedAssetsList.sort()
            return tradedAssetsList
        },
        getNotTradedAssets() {
            var notTradedAssetsObject = {}
            for ( var pair in this.getAllMarketPairs) {
                if(this.getAllMarketPairs[pair].Status==="disabled") {
                   
                    if (Object.keys(notTradedAssetsObject).length == 0) {
                        notTradedAssetsObject = { [this.getAllMarketPairs[pair].BaseAsset]: true }
                        notTradedAssetsObject[this.getAllMarketPairs[pair].QuoteAsset] = true
                    } else {
                        notTradedAssetsObject[this.getAllMarketPairs[pair].BaseAsset] = true
                        notTradedAssetsObject[this.getAllMarketPairs[pair].QuoteAsset] = true
                    }
                }
            }

            var notTradedAssetsList = []
            for (var symbol in notTradedAssetsObject) {
                notTradedAssetsList.push(symbol)
            }
            notTradedAssetsList.sort()
            return notTradedAssetsList
        },
        searchOrders() {
            this.$store.dispatch('orders/searchOrderHistory', { Pair:this.baseAsset+'|'+this.quoteAsset, 
            Status:this.orderStatus, Side: this.orderSide, Start: this.startDate, Stop: this.stopDate, OrderID:"", RefID:"",}) 
            // setTimeout(function () {
            //     this.$forceUpdate()
            // }, 500);
        },
        searchOrderHistory() {

            var marketPairPNL = this.calculateOrderPnL(this.baseAsset+this.quoteAsset, this.getOrderHistory, true )

            this.totalPnLBuy = marketPairPNL.TotalPnLBuy
            this.totalFeesBuy = marketPairPNL.TotalFeesBuy
            this.totalPnLSell = marketPairPNL.TotalPnLSell
            this.totalFeesSell = marketPairPNL.TotalFeesSell

            this.lastBuyPrice = marketPairPNL.LastBuyPrice
            this.lastSellPrice = marketPairPNL.LastSellPrice

            return marketPairPNL.OrderList

        },
    },
}; 
</script>

