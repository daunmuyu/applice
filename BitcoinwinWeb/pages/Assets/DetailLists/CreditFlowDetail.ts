import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { ApiHelper } from "../../../ServerApis/ApiHelper";

var html = require("./creditFlowDetail.html");
export class CreditFlowDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: false,
        data: {
            extData: {}
        },

        itemtitle:"",
        f:"",
        amount: 0,
        id: undefined,
        typeObj: {},
    };
    get needLogin() {
        return true;
    }
    constructor(itemtitle,f,amount,id,typeObj) {
        super(html);

        this.model.itemtitle = itemtitle;
        this.model.typeObj = typeObj;
        this.model.amount = amount;
        this.model.f = f;
        this.model.id = id;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.model.isBusy = true;
        
        AccountApi.GetUserCoinFlowDetail(this, this.model.id, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                console.log(JSON.stringify(ret));
               
                this.model.data = ret;
            }
        });
    }

}