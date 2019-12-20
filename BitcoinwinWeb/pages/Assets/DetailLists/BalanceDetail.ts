import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";

var html = require("./balanceDetail.html");
export class BalanceDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: false,
        id: undefined,
        item:null,
        typeid: undefined,
        amount: undefined,
        data: {},
    };
    get needLogin() {
        return true;
    }
    constructor(item,typeid) {
        super(html);

        this.model.item = item;
        this.model.typeid = typeid;
        this.model.textRes = textRes;
        this.model.amount = item.amount;
        this.model.id = item.id;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    async onNavigationPushed() {
        super.onNavigationPushed();

        this.model.isBusy = true;
        try {
            var ret = await AccountApi.GetFundDayBalanceTreasureInterestDetail(this, this.model.id);

            console.log(JSON.stringify(ret));
            this.model.data = ret;
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }
}