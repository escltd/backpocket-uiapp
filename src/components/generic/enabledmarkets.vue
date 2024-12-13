<template>
    <span class="fr pointer br3 f6 fw6 bg-black-10 near-black ba b--black-05" @click="showMarketPairs=!showMarketPairs"> 
        <div class="inline-flex items-center dim">
            <p class="dib ma0 ph1 pv2 v-mid br3 br--left"> 
                <small><i class="fa" :class="{'fa-caret-down':!showMarketPairs,'fa-circle green':showMarketPairs}" /></small> 
                <img class="mr1" style="width:0.75rem" v-if="market.Exchange == 'crex24'" :src="logoCrex24"/>
                <img class="mr1" style="width:0.75rem" v-if="market.Exchange == 'binance'" :src="logoBinance"/>
                {{market.BaseAsset}} 
            </p>
            <p class="dib ma0 ph1 pv2 v-mid br3 pt2 bg-white near-black tr " style="min-width:9rem">

                <i class="ml1 fa" :class="{'fa-arrow-alt-up green':priceRising(market),'fa-arrow-alt-down red':priceDroping(market)}"/> 
                <span :class="{'green':priceRising(market),'red':priceDroping(market)}"> {{truncateNumber(market.Price)}} </span>  {{market.QuoteAsset}}
            </p>
        </div>
        <div class="w-100 relative fl f7">
            <div v-if="showMarketPairs" class="fade-in absolute top-1 bg-background br3 w-100 z-max">
                <div class="bg-black-10 br3 w-100 h-100 overflow-scroll" style="max-height:16rem">
                    <div v-for="(enabledMarket, index) in enabledmarkets" :key="index" class="w-100 flex dim ph2 pv1 bb b--black-05" @click="$store.dispatch('marketpairs/setDefaultMarketPair', enabledMarket)">
                        <div class="pr1">
                            <img class="mr1" style="width:0.75rem" v-if="enabledMarket.Exchange == 'crex24'" :src="logoCrex24"/>
                            <img class="mr1" style="width:0.75rem" v-if="enabledMarket.Exchange == 'binance'" :src="logoBinance"/>
                        </div>
                        <div class="w-100 tl inline-flex items-center">
                            <p class="pv1 dib ma0 pr0 v-mid tl w-70"> 
                                {{enabledMarket.BaseAsset}}/{{enabledMarket.QuoteAsset}} 
                                <small class="fw5 db w-100 fl" :class="{'green':enabledMarket.PriceChangePercent>0,'red':enabledMarket.PriceChangePercent<0}"> 
                                    {{enabledMarket.PriceChangePercent}}%
                                </small>
                            </p>
                            <p class="pv1 dib ma0 pl0 v-mid tr w-100" style="">
                                <span> {{humanNumber(truncateNumber(enabledMarket.Price))}} </span>
                                <small class="db w-100 fr tr">
                                    <span :class="{'green':priceRising(enabledMarket),'red':priceDroping(enabledMarket)}">
                                        <i class="fa" :class="{
                                            'fa-arrow-alt-up green':enabledMarket.Price > enabledMarket.UpperBand,
                                            'fa-arrow-alt-up yellow': enabledMarket.Price < enabledMarket.UpperBand && enabledMarket.Price > enabledMarket.MiddleBand,
                                            'fa-arrow-alt-down yellow':enabledMarket.Price > enabledMarket.LowerBand && enabledMarket.Price < enabledMarket.MiddleBand,
                                            'fa-arrow-alt-down red':enabledMarket.Price < enabledMarket.LowerBand
                                        }"/> 
                                    </span>
                                    {{enabledMarket.QuoteAsset}}
                                </small>
                            </p>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </span>
</template>


<script type="text/javascript">
    import { humanNumber, truncateNumber } from "@/common"
    import logoCrex24 from "@/assets/img/crex24.png";
    import logoBinance from "@/assets/img/binance.png";

    export default {
        props: ["market", "enabledmarkets"],
        data() { return {
            buyPriceType:"", sellPriceType:"", showMarketPairs: false, logoCrex24, logoBinance,
        }},
        created() {},
        methods: {
            humanNumber,
            truncateNumber,
            priceRising(market) {
                return (market.Price>=market.LastPrice)
            },
            priceDroping(market) {
                return (market.Price<=market.LastPrice)
            },
        },
        components: { },
        beforeMount() { },
        beforeDestroy() { },
    };
</script>
