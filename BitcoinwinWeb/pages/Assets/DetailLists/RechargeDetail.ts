import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";

var html = require("./rechargeDetail.html");
export class RechargeDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        typeObj:null,
        isBusy: false,
        data: {},
    };
    get needLogin() {
        return true;
    }
    constructor(item,typeObj) {
        super(html);

        console.log(JSON.stringify(item));
        this.model.typeObj = typeObj;
        this.model.textRes = textRes;
        this.model.data = item;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

}