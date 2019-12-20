import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";

var html = require("./rechargeCyptoCoinHistories.html");
export class RechargeCyptoCoinHistories extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        startDate: "2019-01-02",
        endDate: "2019-02-03",
        isBusy:false,
    };
    get needLogin() {
        return true;
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

}