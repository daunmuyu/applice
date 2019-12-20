import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { ApiHelper } from "../../../ServerApis/ApiHelper";

var html = require("./fllowOrderDetail.html");
/**带单包赔 明细 详情页面 */
export class FllowOrderDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: false,
        item: undefined,
    };
    get needLogin() {
        return true;
    }
    constructor(item) {
        super(html);

        this.model.item = item;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

}