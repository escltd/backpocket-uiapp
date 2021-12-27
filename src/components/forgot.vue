<template>
    <section class="flex flex-column w-100 vh-100">
        <siteheader/>

        <div class="dt center mw7 cf"> 
            <div class="dtc v-top br2 b--white pt5 w-100 vh-100">
                <div class="cf center card-marketpair br3 f5-ns f6 w-100 relative" style="max-width:240px">
                    
                    <div class="fl w-100 pa3 near-white pt3 f5 fw6 tc tl">
                        Reset Password
                        <p class="db f7 fw0 white-30 i">
                            enter email to reset password or<br/>
                            <router-link to="/login" class="no-underline link fw0 white-70">click to sign in</router-link>
                        </p>
                    </div>
                    
                    <div class="fl w-100 pv2">
                        <input class="pa2 f6 br2 bn w-100 fl tl bg-white-10 near-white" type="text" placeholder="Email" v-model="username" />
                    </div>

                        
                    <div class="fl w-100 pt3 pb2 tc f6">
                        <div v-if="lLogin" class="ph2 pv1 tc center pointer br2 bg-red white inline-flex items-center" @click="login()">
                            <small><i class="pr1 fas fa-lock"></i></small> <span>reset</span>
                        </div>
                        <div v-else class="ph2 pv1 tc center pointer br2 bg-white-10 white-30 inline-flex items-center" >
                            <small><i class="fas fa-spinner fa-spin"></i></small> <span class="pl1">loading...</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

    </section>
</template>

<script type="text/javascript">
import { HTTP } from "@/common";
import { checkRedirect } from "@/common";
import notify from "@/components/notify";import siteheader from "@/components/generic/siteheader";
import sitefooter from "@/components/generic/sitefooter";

export default {
    components: {
        siteheader,
        sitefooter,
        notify
    },
    data() { return {
        date: new Date().getFullYear(),
        lLogin: true,
        lLoading: true,
        notifications: [],
        username: "",
        password: ""
    }},
    methods: {
        forgot() {
            HTTP.post( "/api/forgot", { username: this.email }, { withCredentials: true }).then(response => {
                this.notifications.push(response.data);
                setTimeout(checkRedirect(response.data), 2000);
            }).catch(e => {
                console.log(e);
                this.error = e;
                // this.errors.push(e)
            });
        }
    }
};
</script>
