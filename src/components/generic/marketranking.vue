<template>
    <div class="cf center f7 w-100 " style="max-width:460px;">
        <p class="mv1 tl w-100 pa1 inline-flex items-center" > 
            <span class="f5-ns f6 fl w-100 ">24 Hours Market Ranking</span>
            <small class="fr tr w-80" @click="lShowrankings=!lShowrankings"> 
                Top Movers and Shakers <i class="ml1 fa pointer" :class="{'fa-caret-up':lShowrankings,'fa-caret-down':!lShowrankings}" /> 
            </small>
        </p>

        <small class="db-l" :class="{'bounce-in db':lShowrankings, 'dn':!lShowrankings}">

            <div class="fl w-100">
                <div class="fl w-25 pa1">
                    <div class="ph1-ns pv1 br2 w-100 tc pointer" :class="{'bg-green white':rankGainers,'bg-black-10 black':!rankGainers}" @click="rankGainers=!rankGainers">
                        <i class="fa fa-arrow-alt-up"/> Top Gainers
                    </div>
                </div>
                <div class="fl w-25 pa1">
                    <div class="ph1 pv1 br2 w-100 tc pointer" @click="switchRankAsset(market.BaseAsset)" :class="{'bg-black white':rankAsset==market.BaseAsset,'bg-black-10 black':rankAsset!==market.BaseAsset}"  >
                        {{market.BaseAsset}} 
                    </div>
                </div>
                <div class="fl w-25 pa1">
                    <div class="ph1 pv1 br2 w-100 tc pointer" @click="switchRankAsset(market.QuoteAsset)" :class="{'bg-black white':rankAsset==market.QuoteAsset,'bg-black-10 black':rankAsset!==market.QuoteAsset}" >
                        {{market.QuoteAsset}} 
                    </div>
                </div>
                <div class="fr w-25 pa1">
                    <div class="ph1 pv1 br2 w-100 tc pointer" :class="{'bg-red white':!rankGainers,'bg-black-10 black':rankGainers}" @click="rankGainers=!rankGainers">
                        <i class="fa fa-arrow-alt-down"/> Top Losers 
                    </div>
                </div>
            </div>
            
            
            <div class="mt1 w-100 pb2" >
                
                <div style="height:28rem; align-content: baseline" class="flex w-100 flex-wrap overflow-scroll" v-if="rankGainers">
                    <div class="w-25 pa1" v-for="(marketRank, index) in sortMarketHighRankings()" :key="index">
                        <div @click="toggleMarket(marketRank)" class="ph1 pt2 pb1 br2 w-100 tc pointer bg-black-10 black">
                            <span class="f6 db w-100 green items-center">
                                <small>
                                    <i class="fa" :class="{'dark-green fa-arrow-alt-up':marketDirection(marketRank),'dark-red fa-arrow-alt-down':!marketDirection(marketRank)}"/>
                                </small>
                                {{truncateNumber(marketRank.PriceChangePercent,2)}}%</span>
                            <span class="tracked f8">
                                <small>
                                {{marketRank.BaseAsset}}/{{marketRank.QuoteAsset}}
                                </small>
                            </span>
                            <small class="tracked ttu w-100 db"> <i>{{index+1}}</i> - {{marketRank.Exchange}} <i :class="{'black-30':marketRank.Status=='disabled','green':marketRank.Status=='enabled'}" class="fa fa-check"/> </small>
                        </div>
                    </div>
                </div>
                <div style="height:28rem; align-content: baseline" class="flex w-100 flex-wrap overflow-scroll" v-else>
                    <div class="w-25 pa1" v-for="(marketRank, index) in sortMarketLowRankings()" :key="index">
                        <div @click="toggleMarket(marketRank)" class="ph1 pt2 pb1 br2 w-100 tc pointer bg-black-10 black">
                            <span class="f6 db w-100 red items-center">
                                <small>
                                    <i class="fa" :class="{'dark-green fa-arrow-alt-up':marketDirection(marketRank),'dark-red fa-arrow-alt-down':!marketDirection(marketRank)}"/>
                                </small>
                                {{truncateNumber(marketRank.PriceChangePercent,2)}}%
                            </span>
                            <span class="tracked f8">
                                <small>{{marketRank.BaseAsset}}/{{marketRank.QuoteAsset}}</small>
                            </span>
                            <small class="tracked ttu w-100 db"> <i>{{index+1}}</i> - {{marketRank.Exchange}} <i :class="{'black-30':marketRank.Status=='disabled','red':marketRank.Status=='enabled'}" class="fa fa-check"/> </small>
                        </div>
                    </div>
                </div>                            
                
            </div>
                
        </small>
    </div>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { humanNumber, truncateNumber, sortObjectEntries } from "@/common"

    export default {
        props: ["market"],
        computed: {
            ...mapGetters('marketpairs', ['getAllMarketPairs']),
        },
        data() { return {
            lShowrankings: false, topRankingList:[], lowRankingList:[], rankGainers:true,  rankAsset:"",
        }},
        created() {},
        methods: {
            humanNumber,
            truncateNumber,
            // updateBuyPrice(price){
            //     this.$emit('updateBuyPrice', price);
            // },
            // updateSellPrice(price){
            //     this.$emit('updateSellPrice', price);
            // },
            marketDirection(market) {
               return (market.Price > (market.HighPrice - ((market.HighPrice-market.LowPrice)/2)))
            },
            toggleMarket(market){
                if (market.Status == "enabled"){
                    this.$store.dispatch('marketpairs/disableMarketPair', market)
                } else {
                    this.$store.dispatch('marketpairs/enableMarketPair', market)
                }
            },
            switchRankAsset(asset){
                if (this.rankAsset == asset) {
                    this.rankAsset = ""
                } else {
                    this.rankAsset = asset
                }
            },
            sortMarketHighRankings(){
                var marketRanking = {}
                var allMarketpairs = this.getAllMarketPairs
                
                for (var market in allMarketpairs) {
                    if(this.rankAsset == "" || ( this.rankAsset == allMarketpairs[market].BaseAsset || this.rankAsset == allMarketpairs[market].QuoteAsset ) ){
                        if (parseFloat(allMarketpairs[market].PriceChangePercent)>0) {
                            marketRanking[allMarketpairs[market].Pair] = parseFloat(allMarketpairs[market].PriceChangePercent)
                        }
                    }
                }

                var highRankingMarket = []
                var highRankingList = sortObjectEntries(marketRanking, 100, false)
                for (var market in highRankingList){
                    highRankingMarket.push(allMarketpairs[highRankingList[market]])
                }
                return highRankingMarket
            },
            sortMarketLowRankings(){
                var marketRanking = {}
                var allMarketpairs = this.getAllMarketPairs
                
                for (var market in allMarketpairs) {
                    if(this.rankAsset == "" || ( this.rankAsset == allMarketpairs[market].BaseAsset || this.rankAsset == allMarketpairs[market].QuoteAsset ) ){
                        if (parseFloat(allMarketpairs[market].PriceChangePercent)<0) {
                            marketRanking[allMarketpairs[market].Pair] = parseFloat(allMarketpairs[market].PriceChangePercent)
                        }
                    }
                }

                var lowRankingMarket = []
                var lowRankingList = sortObjectEntries(marketRanking, 100, true)
                for (var market in lowRankingList){
                    lowRankingMarket.push(allMarketpairs[lowRankingList[market]])
                }
                return lowRankingMarket
            },
        },
        components: { },
        beforeMount() { },
        beforeDestroy() { },
    };
</script>
