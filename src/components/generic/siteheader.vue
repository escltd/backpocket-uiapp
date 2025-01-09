<template>
    <header class="flex w-100 inline-flex items-center mw8 center">
        <div class="w-50-l w-40-m w-auto pv3 ph2 inline-flex items-center">
            <img class="w2" src="@/assets/img/logo.svg" />

            <router-link to="/markets" :class="{ 'near-black': page == 'markets', 'black-30': page !== 'markets' }"
                         class="ml2 pointer mt1 f5 fw6 link pa2 dn dib-ns">
                Markets
            </router-link>

            <router-link to="/orders" :class="{ 'near-black': page == 'orders', 'black-30': page !== 'orders' }"
                         class="mh2 pointer mt1 f5 fw6 link pa2 dn dib-ns">
                Orders
            </router-link>

            <router-link to="/opportunity"
                         :class="{ 'near-black': page == 'opportunity', 'black-30': page !== 'opportunity' }"
                         class="mh2 pointer mt1 f5 fw6 link pa2 dn dib-ns">
                Opportunities
            </router-link>

            <router-link to="/assets" :class="{ 'near-black': page == 'assets', 'black-30': page !== 'assets' }"
                         class=" pointer mt1 f5 fw6 link pa2 dn dib-l">
                Assets
            </router-link>

            <router-link to="/predict" :class="{ 'near-black': page == 'predict', 'black-30': page !== 'predict' }"
                         class="ml2 pointer mt1 f5 fw6 link pa2 dn dib-l">
                Predict
            </router-link>

        </div>
        <div class="w-50-l w-60-m w-90 pv3 ph2 relative">
            <span class="fr inline-flex items-center f7">
                <div class="pointer br3 fw6 bg-black-10 near-black ba b--black-10"
                     @click="showSettings = showMenu = false, showAssets = !showAssets">
                    <div class="inline-flex items-center dim">
                        <p class="dib ma0 ph2 pv2 v-mid br3 br--left">
                            <small><i class="fa"
                                   :class="{ 'fa-caret-down': !showAssets, 'fa-circle light-green': showAssets }" /></small>
                            <img class="mr1 " style="width:0.75rem" v-if="getDefaultAsset.Exchange == 'crex24'"
                                 :src="logoCrex24" />
                            <img class="mr1 " style="width:0.75rem" v-if="getDefaultAsset.Exchange == 'binance'"
                                 :src="logoBinance" />
                            {{ getDefaultAsset.Symbol }}
                        </p>
                        <p class="dib ma0 ph2 pv2 v-mid br3 pt2 bg-background tr " style="min-width:9em">
                            {{ humanNumber(truncateNumber(getDefaultAsset.Free)) }}
                        </p>
                    </div>
                    <div class="w-100 relative fl ">
                        <div v-if="showAssets" class="fade-in absolute top-2 bg-background br3 w-100 z-max">
                            <div class="bg-black-10 br3 w-100 h-100 overflow-scroll" style="max-height: 60vh;">
                                <div v-for="(asset, index) in getValuableAssets()" :key="index"
                                     class="w-100 inline-flex items-center dim ph2 pv3 bb b--black-05"
                                     @click="$store.dispatch('assets/setDefaultAsset', asset)">
                                    <p class="dib ma0 pr0 v-mid w-30 inline-flex items-center">
                                        <img class="mr1" style="width:0.75rem" v-if="asset.Exchange == 'crex24'"
                                             :src="logoCrex24" />
                                        <img class="mr1" style="width:0.75rem" v-if="asset.Exchange == 'binance'"
                                             :src="logoBinance" />
                                        {{ asset.Symbol }}
                                    </p>
                                    <p class="dib ma0 pl0 v-mid tr w-70" style="">
                                        {{ humanNumber(truncateNumber(asset.Free)) }}
                                    </p>
                                </div>
                                <div class="w-100 dim pa2 tc bg-near-black mid-gray bb b--black-05"> zero balances are
                                    below </div>
                                <div id="emptyassets">
                                    <div v-for="(asset, index) in getEmptyAssets()" :key="index * index"
                                         class="w-100 inline-flex items-center dim ph2 pv3 bb b--black-05"
                                         @click="$store.dispatch('assets/setDefaultAsset', asset)">
                                        <p class="dib ma0 pr0 v-mid w-30 inline-flex items-center">
                                            <img class="mr1" style="width:0.75rem" v-if="asset.Exchange == 'crex24'"
                                                 :src="logoCrex24" />
                                            <img class="mr1" style="width:0.75rem" v-if="asset.Exchange == 'binance'"
                                                 :src="logoBinance" />
                                            {{ asset.Symbol }}
                                        </p>
                                        <p class="dib ma0 pl0 v-mid tr w-70" style="">
                                            {{ humanNumber(truncateNumber(asset.Free)) }}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <span class="pointer dim bg-black-10 near-black mh3 mh2-l  pv1 ba b--black-10 bw1 ph1 br3 f5"
                      @click="showAssets = showMenu = false, showSettings = !showSettings">
                    <i class="fal fa-cog" />
                </span>
                <span class="pointer dim bg-black-10 near-black pv1 ba b--black-10 ph1 br3 f5"
                      @click="showSettings = showAssets = false, showMenu = !showMenu">
                    <i class="fas fa-ellipsis-h" />
                </span>
            </span>

            <div class="w-100 relative fr pr2">
                <div v-if="showSettings" class="fade-in absolute mr2 top-2 right-1 bg-background br3 f6 z-max"
                     style="width:10em">
                    <div @blur="showSettings = !showSettings" class="bg-black-10 h-100 flex flex-column br3 ">
                        <div class="inline-flex items-center fw6">
                            <span class="inline-flex items-center bg-background br3 bt bl br b--black-20 pa1 w-100">
                                <i class="fa fa-search black-20" />
                                <input type="text" placeholder="Market Pairs"
                                       class="fl w-100 bg-transparent pt1 bn black-50 fw6 f7" v-model="marketSearch" />
                            </span>
                        </div>
                        <div class="w-100 overflow-scroll pointer" style="max-height: 12rem;">
                            <div v-for="(market, index) in getEnabledMarkets()" :key="index"
                                 class="w-100 dim ph2 pv2 bb b--black-05">
                                <div class="w-100 inline-flex items-center justify-between">
                                    <p class="dib ma0 pr0 v-mid inline-flex items-center">
                                        <small class="inline-flex items-center">
                                            <img class="mr1" style="width:0.75rem" v-if="market.Exchange == 'crex24'"
                                                 :src="logoCrex24" />
                                            <img class="mr1" style="width:0.75rem" v-if="market.Exchange == 'binance'"
                                                 :src="logoBinance" />
                                            {{ market.BaseAsset }} / {{ market.QuoteAsset }}
                                        </small>
                                    </p>
                                    <i class="fr ml1 f7 fa fa-check-square black"
                                       @click="$store.dispatch('marketpairs/disableMarketPair', market), showSettings = !showSettings" />
                                </div>
                                <p class="ma0 w-100 tr f7">
                                    <small class="ttu"> {{ market.Exchange }} </small>
                                </p>
                            </div>
                            <div id="disabledmarket">
                                <div v-for="(market, index) in getDisabledMarkets()" :key="index * index"
                                     class="w-100 dim ph2 pv2 bb b--black-05">
                                    <div class="w-100 inline-flex items-center justify-between">
                                        <p class="dib ma0 pr0 v-mid inline-flex items-center">
                                            <small class="inline-flex items-center">
                                                <img class="mr1" style="width:0.75rem"
                                                     v-if="market.Exchange == 'crex24'" :src="logoCrex24" />
                                                <img class="mr1" style="width:0.75rem"
                                                     v-if="market.Exchange == 'binance'" :src="logoBinance" />
                                                {{ market.BaseAsset }} / {{ market.QuoteAsset }}
                                            </small>
                                        </p>
                                        <i class="fr ml1 f7 fa fa-square black-10"
                                           @click="$store.dispatch('marketpairs/enableMarketPair', market), showSettings = !showSettings" />
                                    </div>
                                    <p class="ma0 w-100 tr f7">
                                        <small class="ttu"> {{ market.Exchange }} </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="w-100 justify-between dim ph2 pt2 bg-black br3 bb b--black-05">
                            <p class="items-center inline-flex w-100 dib pb0 ma0 ph0 v-mid white tc pointer"
                               @click="$store.dispatch('marketpairs/restartMarketPair', ''), showSettings = !showSettings">
                                <small class="w-100 tl">Switch Off Markets </small>
                                <small class="w-10 tr"><i class="fa fa-redo" /> </small>
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="showMenu" @click="showMenu = false"
                     class="fade-in absolute mr2 top-2 right-0 bg-background br3 f6 z-max">
                    <div class="bg-black-10 h-100 overflow-scroll flex flex-column br3">
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/login" class="pointer link f near-black inline-flex items-center">
                                <small><i class="far fa-user-secret mr1"></i></small>Login / Signup
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/markets" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-dollar-sign mr1" /></small> Market Prices
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/opportunity" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-dollar-sign mr1" /></small> Opportunities
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/markets" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-trophy mr1" /></small> Prediction Game
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/orders" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-history mr1" /></small> Order History
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/assets" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-coins mr1" /></small> Manage Assets
                            </router-link>
                        </div>
                        <div class="inline-flex items-center dim ph3 pv3 bb b--black-05">
                            <router-link to="/markets" class="pointer link near-black inline-flex items-center">
                                <small><i class="fa fa-cog mr1" /></small> Control Panel
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>


<script type="text/javascript">
    import { mapGetters } from 'vuex';
    import { humanNumber, truncateNumber } from "@/common"

    import logoCrex24 from "@/assets/img/crex24.png";
    import logoBinance from "@/assets/img/binance.png";

    import menulistitem from "@/components/generic/menulistitem";
    import menulistgroup from "@/components/generic/menulistgroup";
    const submenu = [
        { to: "/", icon: "", title: "Home" },
        { to: "/story", icon: "", title: "Our Story" },
        { to: "/product", icon: "", title: "Products" },
        { to: "/faq", icon: "", title: "FAQs" },
        { to: "/blog", icon: "", title: "Blog" },
    ];

    export default {
        props: ["page"],
        computed: {
            ...mapGetters('marketpairs', ['getAllMarketPairs','getEnabledMarketPairs']),
            ...mapGetters('assets', ['getDefaultAsset','getAssetsList']),
        },
        data() { return {
            submenu,
            showMenu: false,
            showAssets: false, 
            showSettings: false, 
            lSwitchmenu: false, 
            marketSearch: "",

            logoCrex24, logoBinance,

            emptyAssetsList:[],
            valuableAssetsList:[]
        }},
        created() {
            // this.websocketMarkets()
        },
        methods: {
            humanNumber,
            truncateNumber,
            getEnabledMarkets() {
                var marketPairs = []
                for (var pair in this.getAllMarketPairs) {
                    if(this.getAllMarketPairs[pair].Status==="enabled") {
                        if (this.marketSearch !=="") {
                            if (this.getAllMarketPairs[pair].Pair.includes(this.marketSearch.toUpperCase())) {
                                marketPairs.push(this.getAllMarketPairs[pair])
                            }
                        } else {
                            marketPairs.push(this.getAllMarketPairs[pair])
                        }
                    }
                }
                return marketPairs
            },
            getDisabledMarkets() {
                var marketPairs = []
                for (var pair in this.getAllMarketPairs) {
                    if(this.getAllMarketPairs[pair].Status==="disabled") {
                        if (this.marketSearch !=="") {
                            if (this.getAllMarketPairs[pair].Pair.includes(this.marketSearch.toUpperCase())) {
                                marketPairs.push(this.getAllMarketPairs[pair])
                            }
                        } else {
                            marketPairs.push(this.getAllMarketPairs[pair])
                        }
                    }
                }
                return marketPairs
            },
            getValuableAssets() {
                var assetsList = []
                var allAssetsList = this.getAssetsList
                for (var symbol in allAssetsList) {
                    if(parseFloat(allAssetsList[symbol].Free) > 0) {
                        assetsList.push(allAssetsList[symbol])
                    }
                }
                return assetsList
            },
            getEmptyAssets() {
                var emptyAssetsList = []
                var allAssetsList = this.getAssetsList
                for (var symbol in allAssetsList) {
                    if(parseFloat(allAssetsList[symbol].Free) == 0.00) {
                        emptyAssetsList.push(allAssetsList[symbol])
                    }
                }
                return emptyAssetsList
            },
            toggleMenu() {
                this.showMenu = !this.showMenu;
                //document.getElementsByTagName("html")[0].classList.toggle('overflow-hidden');
            },
            hideMenuOnScroll() {
                var shrinkOn = 50;
                var distanceY = window.pageYOffset || document.documentElement.scrollTop;
                this.lSwitchmenu = (distanceY < shrinkOn) ? false : true;
            },
            setDefault(){
                
            },
        },
        components: {
            menulistgroup,
            menulistitem,
        },
        beforeMount() {
            document.documentElement.scrollTop = 0;
            window.addEventListener("scroll", this.hideMenuOnScroll, false);
        },
        beforeDestroy() {
            window.removeEventListener("scroll", this.hideMenuOnScroll, false);
        },
    };
</script>
