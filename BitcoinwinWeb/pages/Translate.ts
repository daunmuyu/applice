import { Component } from "jack-one-script";
import  Vue  from "vue";
import { Swiper } from "jack-one-script";
import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import { showError } from "../Global";
import { IndexApi, ProductItem, AdsItem } from "../ServerApis/IndexApi";
import { Login } from "./RegisterLogin/Login";
import { ApiHelper, Description } from "../ServerApis/ApiHelper";
import { TextRes } from "../TextRes";
import { MessageCenter, MessageType } from "../MessageCenter";
import { AccountCenterApi } from "../ServerApis/AccountCenterApi";
import { AccountApi, AccountInfo } from "../ServerApis/AccountApi";
import { TradeApi } from "../ServerApis/TradeApi";
import { CommodityDetail } from "./CommodityDetail/CommodityDetail";
import { Ranking } from "./Home/Ranking";
import { WebBrowser } from "./WebBrowser";
import { Activity } from "./Home/Activity";
import { ContactUs } from "./My/ContactUs";
import { Popularize } from "./My/Popularize";
import { BeginnerGuide } from "./My/BeginnerGuide";
import { HongBao } from "./HongBao";
import { Recharge } from "./Assets/Recharge/Recharge";
import { lang_zh_CN } from "../lang_zh_CN";
import { lang_en_US } from "../lang_en_US";

var html = require("./translate.html");
export class Translate extends BaseComponent
{
    vm: Vue;
    result = {};
    model = {
        isBusy:false,
        datas:[]
    };


    constructor() {
        super(html);

        document.documentElement.style.fontSize = "12px";
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });               

        for (var key in lang_zh_CN.items) {
            var e = lang_en_US.items[key];
            this.model.datas.push({
                c: lang_zh_CN.items[key],
                e,
                key
            });

            //if (!e || /.*[\u4e00-\u9fa5]+.*$/.test(e)) {

            //    this.model.datas.push({
            //        c: lang_zh_CN.items[key],
            //        e,
            //        key
            //    });
            //}
            //else {
            //    this.result[key] = e;
            //}
        }
    }

    save() {
        this.model.datas.forEach(m => {
            if (m.e)
                this.result[m.key] = m.e;
        });
        this.model.isBusy = true;
        console.log(JSON.stringify(this.result));
        //ApiHelper.Log(null, JSON.stringify(this.result), (ret, err) => {
        //    this.model.isBusy = false;
        //    if (err)
        //        alert(JSON.stringify(err));
        //    else {
        //        alert("保存成功");
        //    }
        //});
    }

}