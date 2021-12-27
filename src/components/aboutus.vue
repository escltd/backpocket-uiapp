<template>
    <section>
        <siteheader/>        
        <div class="cf center w-100 pv4 mw8">

            <div class="fl tc w-100 pt4">
                <span class="cf f3 center tracked">ABOUT US</span>
            </div>
     
            <div class="w-50-ns w-100 fl ph3"> 
            
                <p class="w-100 ph2 "> 
                    BackPocket is a crypto market making platform that provides real-time market data, charting, and trading services directly from cryptocurrency exchanges via their APIs.

                    BackPocket also promotes crypto asset accumulation for the financially excluded via its peer to peer market place.

                    BackPocket users can perform peer to peer spot exchanges on the platform.
                </p>

                <div class="fl w-100 pb3">
                    <div class="flex fl w-100 pa2">
                        <span class="fl w4"><small><i class="fa fa-at"/> e-mail: </small></span><span class="fl w-100">info@backpocket.africa</span>
                    </div>

                    <div class="flex fl w-100 pa2">
                        <span class="fl w4"><small><i class="fa fa-mobile"/> telephone: </small></span><span class="fl w-100">+234 703 891 1441, +234 808 128 1488</span>
                    </div>

                    <div class="flex fl w-100 pa2">
                        <span class="fl w4"><small><i class="fa fa-home"/> address: </small></span>
                        <span class="fl w-100"> 
                            <span class="db w-100">2 Fern Valley Estate,</span> 
                            <span class="db pv2 w-100">Off Henry Awofowope Crescent,</span>  
                            <span class="db w-100">Awuse Estate, Opebi Ikeja, Lagos.</span> 
                        </span>
                    </div>
                </div>

                <p class="w-100 ph2 "> We are also available on Live Chat, during regular business hours on +01.00 Greenwich Meridian Time</p>
            </div>           
            
            <div class="w-50-ns w-100 fl ph3"> 
            
                <p class="w-100 ph2 "> We will love to hear from you! <br/><br/> Send us a message and we will respond as soon as possible</p>
                    
                <div class="fl w-50 pa2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="First Name" type="text" v-model="contact.firstname"/>
                </div>

                <div class="fl w-50 pa2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Last Name" type="text" v-model="contact.lastname"/>
                </div>
            
                <div class="fl w-100 pa2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Email Address" type="text" v-model="contact.email"/>
                </div>

                <div class="fl w-50 pa2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Mobile Number" type="text" v-model="contact.mobile"/>
                </div>

                <div class="fl w-50 pa2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Order Number (if you have one)" type="text" v-model="contact.ordernumber"/>
                </div>

                <div class="fl w-100 pa2 mb2">
                    <input class="pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Subject" type="text" v-model="contact.subject"/>
                </div>
                
                <div class="fl w-100 pa2">
                    <textarea class="h4 pa2 ba br2 w-100 bg-white b--light-gray" placeholder="Your Message" type="textarea" v-model="contact.message"/>
                </div>
            
                <div class="fl w-100 pa2">
                    <button class="f6 fr link bn br2 ph3 pv2 mb2 dib white bg-black">Submit</button>
                </div>
                    
            </div>
            
            <featureditems title="Featured collection"/>    
        </div>
        
        <sitefooter/>
    </section>
</template>

<style scoped>

</style>

<script type="text/javascript">
import { HTTP } from "@/common";
import { checkRedirect } from "@/common";
import siteheader from "@/components/generic/siteheader";
import featureditems from "@/components/generic/featureditems";
import newsletter from "@/components/generic/newsletter";
import sitefooter from "@/components/generic/sitefooter";

export default {
  components: {
    siteheader, featureditems, newsletter, sitefooter
  },
  data() {
    return {
      contact: {},
      notifications: [],
    };
  },
  methods: { }
};
</script>
