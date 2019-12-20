import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showError } from "../../Global";
import { WebBrowser } from "../WebBrowser";
import { ApiHelper } from "../../ServerApis/ApiHelper";



var html = require("./aboutus.html");
export class AboutUs extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: 0,
       
    };

    get needLogin() {
        return false;
    }

    constructor() {
        super(html);

        this.model.textRes = textRes;
       

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    aboutUsClick() {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/aboutus/index.${this.model.textRes.langName.replace("-", "_")}.html?t=` + new Date().getTime(),
            fullScreen: true,
            backButtonColor: "#ea3031",
        });
        navigation.push(page);
    }
    fengXianClick() {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/RegistrationAgreement.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["风险揭示_我的"]
        });
        navigation.push(page);
    }
    licai_fengxian_click() {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/licai_fengxian.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["理财风险揭示"]
        });
        navigation.push(page);
    }
}