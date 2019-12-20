import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { SetPayPassword } from "./SetPayPassword";
import { AccountCenterApi, Country } from "../../ServerApis/AccountCenterApi";
import { ModelValidator } from "jack-one-script";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { alertWindow } from "../../GlobalFunc";

var html = require("./realname.html");
export class RealName extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        /**未成年*/
        isMinor: false,
        name: "",
        number: "",
        validator: {},

        /**timeZone */
        selectedCountry: "86",
        selectedCountryText: "",
        countries: <Country[]>[],
        isIos:false,
    };
    get needLogin() {
        return true;
    }

    constructor() {
        super(html);

        this.model.textRes = textRes;
        this.model.isIos = isIOS;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                selectedCountry: (newvalue)=>
                {
                    this.model.selectedCountryText = this.model.countries.filter(m => m.timeZone === newvalue)[0].countryName;
                }
            }
        });
    }  

    uploadClick(e: Event) {
        var input = <HTMLInputElement>e.target;
        var canEle: HTMLCanvasElement;

        var ele = <HTMLElement>input.previousSibling;
        while (ele) {
            if (ele.querySelector)
                canEle = <HTMLCanvasElement>ele.querySelector("CANVAS");
            if (canEle) {
                break;
            }
            else {
                ele = <HTMLElement>ele.previousSibling;
            }
        }

        canEle.width = canEle.offsetWidth;
        canEle.height = canEle.offsetHeight;
        
        var reader = new FileReader();
        reader.onload = (e) => {
            var img = new Image();
            img.onload = () => {
                var ctx = canEle.getContext("2d");
                ctx.clearRect(0, 0, canEle.width, canEle.height);
                ctx.drawImage(img, 0, 0, canEle.width, canEle.height);
            }
            img.src = <string>reader.result;
            
        };
        reader.readAsDataURL(input.files[0]);
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.model.isBusy = true;
        
        AccountCenterApi.GetCountryInfoList(this, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                this.model.countries = ret;
                this.model.selectedCountryText = this.model.countries.filter(m => m.timeZone == this.model.selectedCountry)[0].countryName;
            }
        });
    }

    async submit() {
        if (!ModelValidator.verifyToProperty(this.model, [{ propertyName: "name" }, { propertyName:"number" }], "validator"))
            return;
        if (this.model.isBusy) {
            await  alertWindow(textRes.items['数据仍在加载中，请稍后再试']);
            return;
        }

        //try {
        //    var year = parseInt(this.model.number.substr(6, 4));
        //    if (!isNaN(year) && new Date().getFullYear() - year < 18) {
        //        this.model.isMinor = true;
        //        return;
        //    }
        //}
        //catch (e) {

        //}

        this.model.isBusy = true;

        AccountCenterApi.Certification(this, this.model.number, this.model.name, this.model.selectedCountry == "86" ? 1 : 2, this.model.selectedCountry,async (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                if (err.code == 410 || err.status == 410) {
                    //未成年
                    this.model.isMinor = true;
                    return;
                }
                showError(err);
            }
            else {
                if (this.model.selectedCountry == "86") {
                    ApiHelper.CurrentTokenInfo.realname = this.model.name;
                    ApiHelper.CurrentTokenInfo.certificationstatus = CertificationStatus.CertificationSuccess;
                    MessageCenter.raise(MessageType.CertificationStatusChanged, null);
                    await  alertWindow(textRes.items['认证成功']);
                }
                else {
                    ApiHelper.CurrentTokenInfo.certificationstatus = CertificationStatus.CertificationAuditing;
                    MessageCenter.raise(MessageType.CertificationStatusChanged, null);
                    await  alertWindow(textRes.items['实名认证正在审核']);
                }

                navigation.pop(false);
            }
        });
    }
}