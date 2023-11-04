<template>
    <div class="cf center f7 w-100 ph1" style="max-width:460px">
        <p class="mv0 tl w-100 pv1 inline-flex items-end" > 
            <span class="f5 fl tl w-70 ttu black fw5">
                <img class="h1" v-if="market.Exchange == 'crex24'" :src="logoCrex24"/>
                <img class="h1" v-if="market.Exchange == 'binance'" :src="logoBinance"/>
                {{market.Exchange}}
            </span>
            <span class="fl w-30 tr">
                Order Book
            </span>
        </p>

        
        <div :key="orderBookCount" class="fl w-100">
            <div class="flex flex-row w-100 fl br--left br--right bg-black-10 f7">
                <div class="tl pv1 ph1 w-third"> {{getOrderBook.QuoteAsset}} <br/><small>volume</small> </div>
                <div class="tc pv1 ph1 w-third orange"> <small> bid-ask<br/>spread</small> </div>
                <div class="tr pv1 ph1 w-third "> {{getOrderBook.BaseAsset}} <br/><small>volume</small> </div>
            </div> 
            <div class="flex flex-row w-100 fl br--left br--right bl br b--black-10 f6 fw6 relative white">
                <div style="max-width:100%" :style="{'width':((getOrderBook.BidsQuoteTotal/(getOrderBook.BidsQuoteTotal+getOrderBook.AsksQuoteTotal))*100)+'%'}" 
                    class="bg-green left-0 h-100 z-1 absolute inline-flex items-center" ></div>
                <div style="max-width:100%" :style="{'width':((getOrderBook.AsksQuoteTotal/(getOrderBook.BidsQuoteTotal+getOrderBook.AsksQuoteTotal))*100)+'%'}" 
                class="bg-red right-0 h-100 z-1 absolute inline-flex items-center" ></div>

                <div class="tl pv2 ph1 w-third z-2"> ${{humanNumber(truncateNumber(getOrderBook.BidsQuoteTotal))}} </div>
                <div class="tc pv2 ph1 w-third z-2"> 
                    <span v-if="getOrderbookBids().length>0&&getOrderbookAsks().length>0&&getOrderbookBids()[spreadIndexBid]!==undefined&&getOrderbookAsks()[spreadIndexAsk]!==undefined">
                        {{(((getOrderbookAsks()[spreadIndexAsk].Price - getOrderbookBids()[spreadIndexBid].Price)/getOrderbookBids()[spreadIndexBid].Price) * 100).toFixed(4)}}% 
                    </span>
                </div>
                <div class="tr pv2 ph1 w-third z-2"> ${{humanNumber(truncateNumber(getOrderBook.AsksQuoteTotal))}} </div>
            </div> 
            <div class="fl w-50">
                <div class="flex flex-row w-100 fl bg-black-10 fw6 f7">
                    <div class="tl pv2 ph1 w-50 ">Quantity</div>
                    <div class="tr pv2 ph1 w-50">Bid </div>
                </div>
                <div class="inline-flex flex-column w-100 fl bl bb b--black-10 h5 overflow-scroll">
                    <div class="pt4" v-if="getOrderbookBids().length==0">  <i class="black-10 f1 fa fa-animate fa-spinner fa-spin" /> </div>
                    <div style="min-height:2rem;" class="pointer relative fl inline-flex items-center w-100 bb b--black-10 " v-for="(bid, index) in getOrderbookBids()" :key="index"
                    :class="{'ba b--green':$parent.buyPriceType==index+1,' black':market.Price <= bid.Price && market.Price > 0}" @click="toggleBuyPriceType(index+1)">
                        <div style="max-width:100%" :style="{'width':bid.Percentage+'%'}" :class="{'bg-light-gray ':market.Price > bid.Price, 'bg-light-green': market.Price <= bid.Price && market.Price > 0}" class="right-0 h-100 z-1 absolute inline-flex items-center"></div>
                        <div class="tl ph1 fl w-40 f7 z-2 black">
                            <small>
                                {{humanNumber(truncateNumber(bid.Total))}} <br/> <small class="i"> +{{humanNumber(truncateNumber(bid.Quantity))}} </small> 
                            </small>
                        </div>
                        <div class="tc ph1 fl w-10 f4 z-2 black"> {{index+1}} </div> 
                        <div class="tr ph1 fl w-50 z-2 dark-green">  {{truncateNumber(bid.Price)}} </div>
                    </div>
                </div> 
            </div>
            <div class="fl w-50">
                <div class="flex flex-row w-100 fl bg-black-10 fw6 f7">
                    <div class="tl pv2 ph1 w-50">Ask </div>
                    <div class="tr pv2 ph1 w-50 ">Quantity</div>
                </div> 
                 <div class="inline-flex flex-column w-100 fl br bl bb b--black-10 h5 overflow-scroll">
                     <div class="pt4" v-if="getOrderbookAsks().length==0">  <i class="black-10 f1 fa fa-animate fa-spinner fa-spin" /> </div>
                    <div style="min-height:2rem" class="pointer relative red fl inline-flex items-center w-100 bb b--black-10 " v-for="(ask, index) in getOrderbookAsks()" :key="index"
                    :class="{'ba b--red':$parent.sellPriceType==index+1,' black':market.Price >= ask.Price && market.Price > 0}" @click="toggleSellPriceType(index+1)">
                        <div style="max-width:100%" :style="{'width':ask.Percentage+'%'}" :class="{'bg-light-gray ':market.Price < ask.Price, 'bg-light-red': market.Price >= ask.Price && market.Price > 0}" class="left-0 h-100 z-1 absolute inline-flex items-center"></div>
                        <div class="tl ph1 fl w-50 z-2 dark-red">{{ truncateNumber(ask.Price)}} </div>
                        <div class="tc ph1 fl w-10 f4 z-2 black"> {{index+1}} </div> 
                        <div class="tr ph1 fl w-40 f7 z-2 black"> 
                            <small>
                                {{humanNumber(truncateNumber(ask.Total))}} <br/> <small class="i"> +{{humanNumber(truncateNumber(ask.Quantity))}} </small> 
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row w-100 fl br--left br--right bg-black-10 f7 relative">
                 <div style="max-width:100%" :style="{'width':((getOrderBook.BidsQuoteTotal/(getOrderBook.BidsQuoteTotal+getOrderBook.AsksQuoteTotal))*100)+'%'}" 
                    class="bg-green left-0 h-100 z-1 absolute inline-flex items-center" ></div>
                <div style="max-width:100%" :style="{'width':((getOrderBook.AsksQuoteTotal/(getOrderBook.BidsQuoteTotal+getOrderBook.AsksQuoteTotal))*100)+'%'}" 
                class="bg-red right-0 h-100 z-1 absolute inline-flex items-center" ></div>


                <div class="tc pa1 w-20 white z-2 fw6 "> <small>OPEN</small> </div>
                <div class="tc pa1 w-20 white z-2 fw6 "> <small>LOW</small> </div>
                <div class="tc pa1 w-20 white z-2 fw6 "> <small> Trades</small> </div>
                <div class="tc pa1 w-20 white z-2 fw6 "> <small>HIGH</small> </div>
                <div class="tc pa1 w-20 white z-2 fw6 "> <small>CLOSE</small> </div>
            </div> 
            <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
                <div @click="toggleBuyPriceType('open')"  class="pointer tc pa1 w-20" :class="{'bg-washed-green near-black':$parent.buyPriceType=='open', ' ':$parent.buyPriceType!=='open', 
                    'bg-light-green near-black':market.Price == market.Open}"> 
                    <small >{{market.Open}}</small> 
                </div>
                <div @click="toggleBuyPriceType('low')"  class="pointer tc pa1 w-20" :class="{'bg-washed-green near-black':$parent.buyPriceType=='low', ' ':$parent.buyPriceType!=='low', 
                    'bg-light-green near-black':market.Price == market.Low}"> 
                    <small >{{market.Low}}</small> 
                </div>
                <div class="pointer tc pa1 w-20 orange"> <small> {{market.NumOfTrades}}</small> </div>
                <div @click="toggleSellPriceType('high')" class="pointer tc pa1 w-20 " :class="{'bg-washed-red near-black':$parent.sellPriceType=='high', ' ':$parent.sellPriceType!=='high', 
                    'bg-light-red near-black':market.Price == market.High}"> 
                    <small >{{market.High}}</small> 
                </div>
                <div @click="toggleSellPriceType('close')" class="pointer tc pa1 w-20 " :class="{'bg-washed-red near-black':$parent.sellPriceType=='close', ' ':$parent.sellPriceType!=='close', 
                    'bg-light-red near-black':market.Price == market.Close}"> 
                    <small >{{market.Close}}</small> 
                </div>
            </div> 
        </div>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { humanNumber, truncateNumber } from "@/common"
    import logoCrex24 from "@/assets/img/crex24.png";
    import logoBinance from "@/assets/img/binance.png";

    export default {
        props: ["market"],
        computed: {
            ...mapGetters('orderbooks', ['getOrderBook','orderBookCount','getSampleOrderBook']),
        },
        watch: {
            market: function (newMarket, oldMarket) {
                this.$store.dispatch('orderbooks/setDefaultOrderBook', {Pair: newMarket.Pair, Exchange: newMarket.Exchange});
            },
        },
        data() { return {
             buyPriceType:"", sellPriceType:"", logoCrex24, logoBinance, spreadIndexAsk:0, spreadIndexBid:0, lShowtrades: true
        }},
        created() { 
            this.defaultOrderbook = {
                Pair : "",
                BaseAsset: "***",
                QuoteAsset: "***",
                Exchange: "***",
                AsksTotal: 0,
                BidsTotal: 0,
                Asks: [{Price:0,Quantity:0,Total:0}],
                Bids: [{Price:0,Quantity:0,Total:0}]
            }
        },
        methods: {
            humanNumber,
            truncateNumber,
            toggleBuyPriceType(pricetype) {
                this.$parent.buyPriceType = (this.$parent.buyPriceType==pricetype) ? "" : pricetype
                this.spreadIndexBid = (isNaN(this.$parent.buyPriceType)) ? 0 : pricetype-1
            },
            toggleSellPriceType(pricetype) {
                this.$parent.sellPriceType = (this.$parent.sellPriceType==pricetype) ? "" : pricetype
                this.spreadIndexAsk = (isNaN(this.$parent.sellPriceType)) ? 0 : pricetype-1
            },
            // updateBuyQty(qty){
            //     this.$emit('updateBuyQty', qty);
            //     this.$emit('updateSellQty', qty);
            // },
            // updateSellQty(qty){
            //     this.$emit('updateSellQty', qty);
            //     this.$emit('updateBuyQty', qty);
            // },
            getOrderbookAsks(){
                return (this.getOrderBook !== undefined && this.getOrderBook.Asks !== undefined) ? this.getOrderBook.Asks : [{Price:0}]
            },
            getOrderbookBids(){
                return (this.getOrderBook !== undefined && this.getOrderBook.Bids !== undefined) ? this.getOrderBook.Bids : [{Price:0}]
            },
        },
        components: { },
        mounted() {  
            // this.$store.dispatch('orderbooks/connectWebsocket');
        },
        beforeDestroy() { 
            // this.$store.dispatch('orderbooks/disconnectWebsocket');
        },
    };
</script>
