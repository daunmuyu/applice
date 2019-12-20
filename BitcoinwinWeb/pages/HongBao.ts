import { BaseComponent } from "../BaseComponent";
import Vue from "vue";
import { TextRes } from "../TextRes";
import { showError } from "../Global";
import { AccountApi } from "../ServerApis/AccountApi";
var html = require("./hongBao.html");
export class HongBao extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        /**1:显示红包 2：拆开红包 */
        status: 1,
        isBusy:0,
    };

    get animationOnNavigation() {
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

    openHongBao() {
        if (this.model.isBusy)
            return;

        this.model.isBusy++;
        AccountApi.ReceiveRedEnvelope(this, (ret, err) => {
            this.model.isBusy--;
            if (err)
                showError(err);
            else {
                this.model.status = 2;
            }
        });
    }

    close() {
        navigation.pop(false);
    }
}