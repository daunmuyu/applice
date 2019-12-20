import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { CreditAccount } from "../CreditAccount";
import { BillList } from "../DetailLists/BillList";
import { Home } from "../../Home";

var html = require("./withdraw.html");
class Tab {
    title: string;
    paneltype: string;
    selected: boolean;
}

export class Withdraw extends BaseComponent {
    /**当前是否是信用提现的环境 */
    static IsCreditMode = false;
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        tabs: <Tab[]>[],
        isBusy: false,
        title: undefined,
    };
    constructor(isCreditMode = false) {
        super(html);

        Withdraw.IsCreditMode = isCreditMode;

        if (Withdraw.IsCreditMode) {
            this.model.title = textRes.items["信用资本"] + " " + textRes.items["提现"];
        }
        else {
            this.model.title = textRes.items["提现"];
        }

        this.model.textRes = textRes;
        this.model.tabs[0] = new Tab();
        this.model.tabs[0].title = textRes.items["法币提现"];
        this.model.tabs[0].paneltype = "fiatwithdraw";
        this.model.tabs[0].selected = false;

        if (!isCreditMode || (CreditAccount.CreditInfo.items && CreditAccount.CreditInfo.items.filter(m => m.coinNum).length)) {
            this.model.tabs[1] = new Tab();
            this.model.tabs[1].title = textRes.items["币币提现"];
            this.model.tabs[1].paneltype = "bbwithdraw";
            this.model.tabs[1].selected = false;
        }


        //移除法币提现
        if (isCreditMode) {
            this.model.tabs.splice(0, 1);
        }
        this.model.tabs[0].selected = true;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }
    helpClick() {
        Home.instance.contactUsClick();
    }
    billList() {
        navigation.push(new BillList(9, Withdraw.IsCreditMode));
    }

    tabClick(tab: Tab) {
        this.model.tabs.forEach((item) => {
            item.selected = (item === tab);
        });
    }

   
}