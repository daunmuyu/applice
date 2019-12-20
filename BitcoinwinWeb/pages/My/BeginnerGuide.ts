import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { WebBrowser } from "../WebBrowser";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";

import { RealName } from "./RealName";
import { Recharge } from "../Assets/Recharge/Recharge";
import { Withdraw } from "../Assets/Withdraw/Withdraw";
import { MainPage } from "../MainPage";

var html = require("./beginnerGuide.html");
export class BeginnerGuide extends BaseComponent {
    vm: Vue;
    fromWhere: string;
    model = {
        textRes: <TextRes>{},
        isBusy:false,
    };

    get needLogin() {
        return false;
    }

    constructor(fromWhere: string) {
        super(html);

        this.fromWhere = fromWhere;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }
    open(imgname: string, count: number,title:string) {
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/BeginnersGuide/index.html?imgname=${imgname}&lang=${textRes.langName.replace("-", "_")}&count=${count}`,
            fullScreen: true,
            title: textRes.items[title],
            backButtonColor: "#fff",
            invokeIsReadyOnLoad: true,
            jsAction: this._finishAction,
        });
        navigation.push(page);
    }

    private _finishAction: any;
    positionClick() {
        this.recordAction(this.fromWhere + "_Teach_查看持仓");
        this._finishAction = (action: string) => {
            navigation.pop(false);
        };
        this.open("checkpositions" , 2 , "查看持仓");
    }

    rechargeClick() {
        this.recordAction(this.fromWhere + "_Teach_充值");
        var imgname = encodeURIComponent(`imgs_${textRes.langName.replace("-", "_")}/recharge.png`);
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/BeginnersGuide/index2.html?imgname=${imgname}`,
            fullScreen: false,
            title: textRes.items["充值"],
        });
        navigation.push(page);
    }

    withdrawClick() {
        this.recordAction(this.fromWhere + "_Teach_提现");
        var imgname = encodeURIComponent(`imgs_${textRes.langName.replace("-", "_")}/withdraw.png`);
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/BeginnersGuide/index2.html?imgname=${imgname}`,
            fullScreen: false,
            title: textRes.items["提现"],
        });
        navigation.push(page);
    }

    orderClick() {
        this.recordAction(this.fromWhere + "_Teach_交易");
        var imgname = encodeURIComponent( `imgs_${textRes.langName.replace("-", "_")}/trade.png`);
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/BeginnersGuide/index2.html?imgname=${imgname}`,
            fullScreen: false,
            title: textRes.items["交易"],
        });
        navigation.push(page);
    }
}