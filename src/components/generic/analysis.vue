<template>
    <div class="cf center f7 w-100 ph1" style="max-width:460px">

        <p class="mv0 tl w-100 inline-flex items-end black">
            <span class="fl w-20 tl fw6 bg-dark-green pa1 pt2 white">
                <span class="pointer" @click="toggleBuyPriceType(getEntry())">{{ getEntry() }}</span>
            </span>
            <span class="fl w-60 tc fw6 pv1">TECHNICAL ANALYSIS</span>
            <span class="fl w-20 tr fw6 bg-dark-red pa1 pt2 white">
                <span class="pointer" @click="toggleSellPriceType(getExit())">{{ getExit() }}</span>
            </span>
        </p>
        <p class="mv0 tl w-100 pa1 inline-flex items-end white" :class="getMainTrendColor()">
            <span class="fl w-30 tl truncate">
                <b>{{ getTrend() }}</b>
            </span>
            <span class="fl w-70 tr truncate">
                &nbsp; <b>{{ getInterval('').Pattern.Chart }}</b>
            </span>
        </p>
        <p class="mv0 tl w-100 pa1 inline-flex items-end white" :class="getTrendColor('')">
            <span class="fl w-30 tl truncate">
                {{ getInterval("").Trend }} <small>@ <b>{{ getInterval("").RSI }}</b> RSI</small>
            </span>
            <span class="fl w-70 tr truncate">
                &nbsp;<b>{{ getInterval('').Pattern.Candle }}</b>
            </span>
        </p>


        <div class="fl w-100">
            <div class="flex flex-row w-100 fl br--left br--right bg-black-10 white f7 relative">
                <div @click="setInterval('1m')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('1m')">
                    <small>1m <i v-if="defaultInterval == '1m'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('5m')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('5m')">
                    <small>5m <i v-if="defaultInterval == '5m'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('15m')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('15m')">
                    <small>15m <i v-if="defaultInterval == '15m'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('1h')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('1h')">
                    <small>1h <i v-if="defaultInterval == '1h'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('4h')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('4h')">
                    <small>4h <i v-if="defaultInterval == '4h'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('1d')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('1d')">
                    <small>1d <i v-if="defaultInterval == '1d'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('3d')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('3d')">
                    <small>3d <i v-if="defaultInterval == '3d'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('1w')" class="pointer tc pv1 w-20 z-2 fw6 " :class="getTrendColor('1w')">
                    <small>1w <i v-if="defaultInterval == '1w'" class="fa fa-check" /></small>
                </div>
                <div @click="setInterval('1M')" class="pointer tc pv1 w-10 z-2 fw6 " :class="getTrendColor('1M')">
                    <small>1M <i v-if="defaultInterval == '1M'" class="fa fa-check" /></small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
                <div class="b pointer tc pa1 w-20 truncate">
                    <small><b class="">{{ defaultInterval }} is <span class="ttu">{{ getInterval("").Trend
                                }}</span></b></small>
                </div>
                <div class="pointer tc pa1 w-20">
                    <small>SUPPORT</small>
                </div>
                <div class="pointer tc pa1 w-20">
                    <small>ENTRY</small>
                </div>
                <div class="pointer tc pa1 w-20 truncate">
                    <small>% SPREAD</small>
                </div>
                <div class="pointer tc pa1 w-20 truncate">
                    <small>RESISTANCE</small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
                <div class="pointer tc pa1 w-20 truncate">
                    <i v-if="market.Price > getInterval('').SMA10.Entry" class="fa fa-arrow-alt-up green" />
                    <i v-else class="fa fa-arrow-alt-down red" />
                    <small>SMA10 </small>
                </div>
                <div class="pointer tc pa1 w-20 " :class="getSupportColor('SMA10')">
                    <small @click="toggleBuyPriceType(getInterval('').SMA10.Support)">
                        {{ getInterval("").SMA10.Support }}</small>
                </div>
                <div class="pointer tc pa1 w-20 fw6" :class="getEntryColor('SMA10')">
                    <small @click="toggleBuySellPriceType(getInterval('').SMA10.Entry)"> {{ getInterval("").SMA10.Entry
                        }}</small>
                </div>
                <div class="pointer tc pa1 w-20">
                    <small>{{ getInterval("").SMA10.Spread }}%</small>
                </div>
                <div class="pointer tc pa1 w-20 ">
                    <small @click="toggleSellPriceType(getInterval('').SMA10.Resistance)">{{
                        getInterval("").SMA10.Resistance }}</small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
                <div class="pointer tc pa1 w-20 truncate">
                    <i v-if="getInterval('').SMA10.Entry > getInterval('').SMA20.Entry"
                       class="fa fa-arrow-alt-up green" />
                    <i v-else class="fa fa-arrow-alt-down red" />
                    <small>SMA20 </small>
                </div>
                <div class="pointer tc pa1 w-20 " :class="getSupportColor('SMA20')">
                    <small @click="toggleBuyPriceType(getInterval('').SMA20.Support)">
                        {{ getInterval("").SMA20.Support }}</small>
                </div>
                <div class="pointer tc pa1 w-20 fw6" :class="getEntryColor('SMA20')">
                    <small @click="toggleBuySellPriceType(getInterval('').SMA20.Entry)"> {{ getInterval("").SMA20.Entry
                        }}</small>
                </div>
                <div class="pointer tc pa1 w-20">
                    <small>{{ getInterval("").SMA20.Spread }}%</small>
                </div>
                <div class="pointer tc pa1 w-20 ">
                    <small @click="toggleSellPriceType(getInterval('').SMA20.Resistance)">{{
                        getInterval("").SMA20.Resistance }}</small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right bb bl br b--black-10 f7">
                <div class="pointer tc pa1 w-20 truncate">
                    <i v-if="getInterval('').SMA20.Entry > getInterval('').SMA50.Entry"
                       class="fa fa-arrow-alt-up green" />
                    <i v-else class="fa fa-arrow-alt-down red" />
                    <small>SMA50 </small>
                </div>
                <div class="pointer tc pa1 w-20 " :class="getSupportColor('SMA50')">
                    <small @click="toggleBuyPriceType(getInterval('').SMA50.Support)">
                        {{ getInterval("").SMA50.Support }}</small>
                </div>
                <div class="pointer tc pa1 w-20 fw6" :class="getEntryColor('SMA50')">
                    <small @click="toggleBuySellPriceType(getInterval('').SMA50.Entry)"> {{ getInterval("").SMA50.Entry
                        }}</small>
                </div>
                <div class="pointer tc pa1 w-20">
                    <small>{{ getInterval("").SMA50.Spread }}%</small>
                </div>
                <div class="pointer tc pa1 w-20 ">
                    <small @click="toggleSellPriceType(getInterval('').SMA50.Resistance)">{{
                        getInterval("").SMA50.Resistance }}</small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right f7 relative">
                <p class="mv0 tl w-100 pv1 inline-flex itemsx-end">
                    <span class="fl w-100 tc fw6">
                        FIBONACCI RETRACEMENT LEVELS
                    </span>
                </p>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right white f7 relative">
                <div class="pointer tc pa1 w-20 z-2 fw6" :class="getFibonacciColor('0.236')"
                     @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.236'])">
                    <small>0.236</small>
                </div>
                <div class="pointer tc pa1 w-20 z-2 fw6" :class="getFibonacciColor('0.382')"
                     @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.382'])">
                    <small>0.382</small>
                </div>
                <div class="pointer tc pa1 w-20 z-2 fw6" :class="getFibonacciColor('0.500')"
                     @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.500'])">
                    <small>0.500</small>
                </div>
                <div class="pointer tc pa1 w-20 z-2 fw6" :class="getFibonacciColor('0.618')"
                     @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.618'])">
                    <small>0.618</small>
                </div>
                <div class="pointer tc pa1 w-20 z-2 fw6" :class="getFibonacciColor('0.786')"
                     @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.786'])">
                    <small>0.786</small>
                </div>
            </div>
            <div class="flex flex-row w-100 fl br--left br--right f7 relative bb bl br b--black-10">
                <div class="tc pa1 w-20 black z-2 pointer">
                    <small @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.236'])">{{
                        getInterval("").RetracementLevels["0.236"] }}</small>
                </div>
                <div class="tc pa1 w-20 black z-2 pointer">
                    <small @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.382'])">{{
                        getInterval("").RetracementLevels["0.382"] }}</small>
                </div>
                <div class="tc pa1 w-20 black z-2 pointer">
                    <small @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.500'])">{{
                        getInterval("").RetracementLevels["0.500"] }}</small>
                </div>
                <div class="tc pa1 w-20 black z-2 pointer">
                    <small @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.618'])">{{
                        getInterval("").RetracementLevels["0.618"] }}</small>
                </div>
                <div class="tc pa1 w-20 black z-2 pointer">
                    <small @click="toggleBuySellPriceType(getInterval('').RetracementLevels['0.786'])">{{
                        getInterval("").RetracementLevels["0.786"] }}</small>
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
            ...mapGetters('analysis', ['getAllAnalysis',]),
        },
        data() { return {
            logoCrex24, logoBinance, defaultInterval:"",
        }},
        created() { 
            if (this.defaultInterval == "") {
                this.setInterval("1m")
            }
        },
        methods: {
            humanNumber,
            truncateNumber,
            getDigitLenght(digit) {
                if (digit == 0 || digit == undefined) {
                    return 0
                }
                return digit.toString().split(".")[1].length || 0
            },
            getTrend() {
                if (this.getAllAnalysis[this.market.Pair] == undefined) {
                    return ""
                }
                return this.getAllAnalysis[this.market.Pair].Trend
            },
            getEntry(){
                var entry = 0
                var pairAnalysis = this.getAllAnalysis[this.market.Pair]
                if (pairAnalysis == undefined) {
                    return entry
                }
                
                var curInterval = this.getInterval('')
                for (var sma in curInterval) {
                    if (!sma.includes("SMA")) {
                        continue
                    }
                    if (curInterval[sma].Support == 0) {
                        continue
                    }
                    if (entry == 0) {
                        entry = curInterval[sma].Support
                    }
                        
                    if (curInterval[sma].Support > this.market.Price && 
                        entry > curInterval[sma].Support ) {
                        entry = curInterval[sma].Support
                    }
                }


                for (var sma in curInterval) {
                    if (!sma.includes("SMA")) {
                        continue
                    }

                    if (curInterval[sma].Entry < this.market.Price && 
                        curInterval[sma].Entry > entry) {
                        entry = curInterval[sma].Entry
                    }
                }
                return entry
            },
            getExit(){
                var exit = 0
                var pairAnalysis = this.getAllAnalysis[this.market.Pair]
                if (pairAnalysis == undefined) {
                    return exit
                }

                var curInterval = this.getInterval('')
                for (var sma in curInterval) {
                    if (!sma.includes("SMA")) {
                        continue
                    }
                    if (curInterval[sma].Resistance == 0) {
                        continue
                    }
                    if (exit == 0) {
                        exit = curInterval[sma].Resistance
                    }
                        
                    if (curInterval[sma].Resistance > this.market.Price && 
                        exit > curInterval[sma].Resistance ) {
                        exit = curInterval[sma].Resistance
                    }
                }

                for (var sma in curInterval) {
                    if (!sma.includes("SMA")) {
                        continue
                    }
                    if (curInterval[sma].Entry > this.market.Price && 
                        curInterval[sma].Entry < exit) {
                        exit = curInterval[sma].Entry
                    }
                }
                return exit
            },
            getMainTrendColor(){
                var color = "";
                switch (this.getTrend()) {
                    case "Strong Bullish":
                        color = "bg-dark-green";
                        break;
                    case "Bullish":
                        color = "bg-green";
                        break;
                    case "Strong Bearish":
                        color = "bg-dark-red";
                        break;
                    case "Bearish":
                        color = "bg-red";
                        break;
                    default:
                        color = "bg-black";
                        break;
                }
                return color
            },
            getInterval(interval) {
                if (interval == "") {
                    interval = this.defaultInterval
                }
                var pairAnalysis = this.getAllAnalysis[this.market.Pair]
                if (pairAnalysis !== undefined) {
                    if (pairAnalysis["Intervals"] !== undefined) {
                        if (pairAnalysis["Intervals"][interval] !== undefined && pairAnalysis["Intervals"][interval] !== null) {
                            return pairAnalysis["Intervals"][interval]
                        } 
                    }
                }

                var sma = {
                    "Trend": "", "Support": 0,
                    "Resistance": 0, "Spread": 0,
                    "Entry": 0, "StopLoss": 0, "TakeProfit": 0
                }

                return {
                    "Timeframe": "", "Trend": "", "RSI": 0, Pattern: {Chart:"", Candle:""},
                    "BollingerBands": { "lower": 0, "middle": 0, "upper": 0, },
                    "SMA10": sma, "SMA20": sma, "SMA50": sma,
                    "RetracementLevels": { "0.236": 0, "0.382": 0, "0.500": 0, "0.618": 0, "0.786": 0, }    
                }
            },
            getSupportColor(support) {
                var color = "black";
                var supportPrice = this.getInterval('')[support].Support
                if (this.market.Price < supportPrice ) {
                    color = "red";
                }
                return color
            },
            getResistanceColor(resistance) {
                var color = "black";
                var resistancePrice = this.getInterval('')[resistance].Support
                if (this.market.Price > resistancePrice) {
                    color = "green";
                }
                return color
            },
            getEntryColor(entry) {
                var color = "black";
                var entryPrice = this.getInterval('')[entry].Entry
                if (entryPrice < this.market.Price) {
                    color = "green";
                } else if (entryPrice > this.market.Price) {
                    color = "red";
                }
                return color
            },
            getFibonacciColor(fibonacci) {
                var color = "bg-black";
                var fibonacciPrice = this.getInterval('').RetracementLevels[fibonacci]
                if (fibonacciPrice < this.market.Price) {
                    color = "bg-green";
                } else if (fibonacciPrice > this.market.Price) {
                    color = "bg-red";
                }
                return color
            },
            getTrendColor(interval) {

                var color = "";
                switch (this.getInterval(interval).Trend) {
                    case "Strong Bullish":
                        color = "bg-dark-green";
                        break;
                    case "Bullish":
                        color = "bg-dark-green";
                        break;
                    case "Bearish":
                        color = "bg-dark-red";
                        break;
                    case "Strong Bearish":
                        color = "bg-dark-red";
                        break;
                    default:
                        color  = "bg-black";
                        break;
                }
                return color
            },
            setInterval(interval) {
                this.defaultInterval = interval
            },
            toggleBuyPriceType(price) {
                price = truncateNumber(price, this.getDigitLenght(this.market.Price))
                this.$emit('updateBuyPrice', price);
            },
            toggleSellPriceType(price) {
                price = truncateNumber(price, this.getDigitLenght(this.market.Price))
                this.$emit('updateSellPrice', price);
            },
            toggleBuySellPriceType(price) {
                this.toggleBuyPriceType(price);
                this.toggleSellPriceType(price);
            },
        },
        components: { },
        mounted() {  
            this.$store.dispatch('analysis/connectWebsocket');
        },
        beforeDestroy() { 
            // this.$store.dispatch('analysis/disconnectWebsocket');
        },
    };
</script>
