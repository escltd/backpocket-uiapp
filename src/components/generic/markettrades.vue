<template>
    <div :key="getTradeCount" class="cf center f7 w-100 ph1 pt2" style="max-width:460px;">
        <div class="flex flex-row w-100 fl f7">
            <span class="tl w-50">{{market.NumOfTrades}} Trades</span>

            <small class="tr w-50" @click="lShowtrades=!lShowtrades"> 
                <span v-if="lShowtrades">Show</span>
                <span v-else>Hide</span> Trades
                <i class="ml1 fa pointer" :class="{'fa-caret-up':lShowtrades,'fa-caret-down':!lShowtrades}" /> 
            </small>
        </div>

        <small class="w-100 fl mv1" :class="{'dn':lShowtrades}">
            <div class="flex flex-row w-100 fl br--left br--right bg-white-10 ">
                <div class="tl pa1 w-40"> Time </div>
                <div class="tc pa1 w-30 ">  Price ({{market.QuoteAsset}}) </div>
                <div class="tr pa1 w-30 "> Amount ({{market.BaseAsset}}) </div>
            </div> 
            <div style="height:8.4rem;" class="inline-flex flex-column w-100 fl bl br bb b--white-10 h-100 overflow-scroll ">

                <div class="pt4" v-if="getMarketTrades().length==0"> 
                    <i class="white-10 f1 fa fa-animate fa-spinner fa-spin" />
                </div>

                <div style="min-height:1.2rem" class=" pointer fl inline-flex items-center w-100 bb b--white-10" v-for="(trade, index) in getMarketTrades()" :key="index">
                    <div class="tl ph1 w-40"> 
                        {{humanDate(trade.TradeTime.substring(0,19)).substring(15,30)}}
                        <small class="ttl"> 
                            {{humanDate(trade.TradeTime.substring(0,19)).substring(0,11)}}
                            <small>{{humanDate(trade.TradeTime.substring(0,19)).substring(11,15)}}</small>
                        </small>
                    </div>
                    <div class="tc ph1 w-30 " :class="{'green':trade.Side=='Buy','red':trade.Side=='Sell'}" > {{truncateNumber(trade.Price)}} </div>
                    <div class="tr ph1 w-30"> {{truncateNumber(trade.Quantity)}} </div>
                </div>
            </div>
        </small>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { humanDate, humanNumber, truncateNumber, sortObjectEntries } from "@/common"

    export default {
        props: ["market"],
        computed: {
            ...mapGetters('trades', ['getAllTrades','getTradeCount']),
        },
        data() { return {
            lShowtrades: false,
        }},
        created() {},
        methods: {
            humanDate,
            humanNumber,
            truncateNumber,
            getMarketTrades() {
                var marketTrades = [];
                // if (this.getAllTrades[this.market.Pair + '-' + this.market.Exchange] !== undefined) {
                //     marketTrades = this.getAllTrades[this.market.Pair + '-' + this.market.Exchange]
                // }

                for (var tradeID in this.getAllTrades) {
                    var trade = this.getAllTrades[tradeID]
                    if(this.market.Pair == trade.Pair && this.market.Exchange == trade.Exchange){
                        marketTrades.push(trade)
                    }
                }
                return marketTrades.reverse()
            },
        },
        components: { },
        beforeMount() { },
        beforeDestroy() { },
    };
</script>
