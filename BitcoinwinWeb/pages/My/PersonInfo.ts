import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { SetPayPassword } from "./SetPayPassword";
import { RealName } from "./RealName";
import { setTimeout } from "timers";

var html = require("./personInfo.html");
export class PersonInfo extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        phone_number: "",
        certificationstatus: "",
        certificationSuccess: false,
        canCertification:false,
        isBusy:false,
    };
    get needLogin() {
        return true;
    }

    constructor() {
        super(html);

        this.model.textRes = textRes;

        this.checkStatus();

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            errorCaptured: (err, vue, info) => {
                alert(JSON.stringify(err));
                return false;
            },
        });

    }

    checkStatus() {
        if (ApiHelper.CurrentTokenInfo) {
            this.model.phone_number = ApiHelper.CurrentTokenInfo.phone_number;

            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                this.model.certificationstatus = textRes.items["已认证"];
                this.model.certificationSuccess = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail) {
                this.model.certificationstatus = textRes.items["认证失败"];
                this.model.canCertification = true;
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationAuditing) {
                this.model.certificationstatus = textRes.items["审核中..."];
            }
            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == undefined) {
                this.model.certificationstatus = textRes.items["未认证"];
                this.model.canCertification = true;
            }
        }     
    }

    onNavigationActived(isresume) {
        super.onNavigationActived(isresume);

        if (isresume) {
            this.checkStatus();
        }
    }

    

    modifyPwdClick() {
        navigation.push(new ForgetPwd());
    }

    setPayPwdClick() {
        navigation.push(new SetPayPassword());
    }

    realNameClick() {

        if (ApiHelper.CurrentTokenInfo.certificationstatus == undefined ||
            ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail)
            navigation.push(new RealName());
    }
}