<template>
	<section>
		<siteheader/>
            <article class="mw8 center dt w-100 bg-white pv2" >
                <div class="dtc v-mid tc black ph3 ph4-l">
                    <h1 class="f2 f1-l fw5 tc">Contact SUPPORT</h1>
                </div>
            </article>

            <section class="bg-white mw8 tc center flex flex-row-ns flex-column">
                <div class="fl w-100 w-50-l order-1 order-2-ns">
                    <div class="dt w-100 tracked near-black" style="max-height:800px">
                        <div class="dtc v-mid pv5 ph4">
                            <legend class="pa0 ph2 f4 fw6 f3-ns mb3 tl ttu tracked w-100">CHAT WITH US</legend>
                            <legend class="pa0 ph2 f6 fw4 f5-ns mb3 tl tracked w-100 pv1 lh-landing">
                                You can call us:<br/>
                                <a class = "link white" href = "tel:2348064259556" > (234) 806 425 9556 </a>
                            </legend>


                            <legend class="pa0 ph2 f6 fw4 f5-ns mb3 tl tracked w-100 pt1 pb3 lh-landing">Or send us an email: <br/> sales@savenflex.com</legend>
                            <div class="cf w-100 pv3"></div>
                            <legend class="pa0 ph2 f4 fw6 f3-ns mb3 tl ttu tracked w-100">VISIT OUR OFFICE</legend>
                            <legend class="pa0 ph2 f6 fw4 f5-ns mb3 tl tracked w-100 pv1 lh-landing">Still have questions?</legend>
                            <legend class="pa0 ph2 f6 fw4 f5-ns mb3 tl tracked w-100 pv1 lh-landing">
                                We are available <br/>
                                Mon - Fri from 9am - 5pm <br/>

                                #7 Ibiyinka Olorunbe, <br/>

                                Victoria Island, Lagos, <br/>Nigeria <br/>
                            </legend>
                        </div>
                    </div>
                </div>
                <div class="fl w-100 w-50-l ph2">
                    <div class="dt w-100 tracked">
                        <div class="dtc v-mid tl">
                            <legend class="pa0 ph2 f5 fw6 f4-ns mv3 ttu tracked w-100">SEND US A MESSAGE:</legend>
                            <legend class="pa0 ph2 f6 fw4 f5-ns mb3 tracked w-100 pb2">
                                <small>Someone from our team will be in touch within 1-2 business days.</small>
                            </legend>

                            <div class="cf w-100 ">
                                <div class="fl ph2">
                                    <label class="db fw4 lh-copy f6">TITLE</label>
                                    <input class="w3 f6 input-reset bn black bg-near-white pa2 lh-solid" type="text" placeholder=""  v-model="contact.title" />
                                </div>
                            </div>

                            <div class="cf w-100 pv2">
                                <div class="fl w-50 ph2">
                                    <label class="db fw4 lh-copy f6">FIRST NAME</label>
                                    <input class="fl w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" type="text" placeholder=""  v-model="contact.frstname" />
                                </div>

                                <div class="fl w-50 ph2">
                                    <label class="db fw4 lh-copy f6">LAST NAME</label>
                                    <input class="fl w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" type="text" placeholder=""  v-model="contact.lastname" />
                                </div>
                            </div>

                            <div class="cf w-100 pv2">
                                <div class="fl w-50 ph2">
                                    <label class="db fw4 lh-copy f6">COMPANY</label>
                                    <input class="fl w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" type="text" placeholder=""  v-model="contact.company" />
                                </div>

                                <div class="fl w-50 ph2">
                                    <label class="db fw4 lh-copy f6">MOBILE</label>
                                    <input class="fl w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" type="text" placeholder=""  v-model="contact.mobile" />
                                </div>
                            </div>

                            <div class="cf w-100 pv2">
                                <div class="fl w-100 ph2">
                                    <label class="db fw4 lh-copy f6">EMAIL</label>
                                    <input class="fl w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" type="email" placeholder=""  v-model="contact.email" />
                                </div>
                            </div>

                            <div class="cf w-100 pv2">
                                <div class="fl w-100 ph2">
                                    <label class="db fw4 lh-copy f6">MESSAGE</label>
                                    <textarea class="h4 w-100 f6 input-reset bn black bg-near-white pa2 lh-solid" v-model="contact.message"></textarea>
                                </div>

                                <div class="fl w-100 pa2">
                                    <span @click="submitContact" class="f6 button-reset fl pa3 tc bn bg-animate ttu tracked bg-dark-green br1 hover-bg-green white pointer">SEND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <sitefooter/>
	</section>
</template>

<script>
import {HTTP} from '@/common';
import notify from "@/components/notify"
import siteheader from "@/components/generic/siteheader";
import sitefooter from "@/components/generic/sitefooter";

export default {
	components: {notify, siteheader, sitefooter},
	data(){ return { contact:{firstname:"",lastname:"", email:""}, notifications:[]}},
	methods: {
        submitContact() {
            const app = this;
            app.notifications = [];
            HTTP.post("https://cp.essentials.ng/api/signup-newsletter", app.contact,{withCredentials: true}).then((response) => {
                console.log(response.data);
                app.notifications.push(response.data)
            }).catch((e) => {
                app.status = {}
                console.log(e)
            })
        },
    }
}
</script>
