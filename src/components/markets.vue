<template>
    <section class="flex flex-column w-100 vh-100">
        <siteheader page="markets"  />    
        <marketpairs :market="getMarketPair" :enabledmarkets="getEnabledMarketPairs" />
    </section>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';
import siteheader from "@/components/generic/siteheader";
import marketpairs from "@/components/marketpairs";

export default {
    computed: {
        ...mapGetters('assets', ['getAssetsList']),
        ...mapGetters('marketpairs', ['getMarketPair', 'getEnabledMarketPairs']),
    },
    components: { siteheader, marketpairs },
    data() { return { }},
};
</script>
