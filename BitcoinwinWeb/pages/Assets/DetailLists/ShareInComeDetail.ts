import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";

var html = require("./shareInComeDetail.html");
export class ShareInComeDetail extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: false,
        date: undefined,
        id:undefined,
        level: undefined,
        data: {},
        amount: undefined,
        title: null,
    };
    get needLogin() {
        return true;
    }
    constructor(title,date, id, amount,level) {
        super(html);

        this.model.title = title;
        this.model.textRes = textRes;
        this.model.date = date;
        this.model.level = level;
        this.model.id = id;
        this.model.amount = amount;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    loadData() {

        this.model.isBusy = true;

        if (this.model.level) {
            console.log(this.model.level + " ==> " + this.model.date);
            AccountApi.GetTotalFundDayDistributionIncomeDetail(this, this.model.level, this.model.date, (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    console.log(ret);
                    this.model.data = ret;
                }
            });
        }
        else {
            AccountApi.GetFundDayTotalIncomeDetail(this,  this.model.id , (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    console.log(ret);

                    this.model.data = ret;
                }
            });
        }
       
    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.loadData();
    }
}