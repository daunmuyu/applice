import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";

import { BillList } from "../DetailLists/BillList";
import { Home } from "../../Home";
var html = require("./recharge.html");
interface TabItem {
    text: string;
    selected: boolean;
    paneltype: string;
}

export class Recharge extends BaseComponent {
    static IsCreditMode = false;
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        tabs: <TabItem[]>[],
        selectedTab: <TabItem>null,
        title: undefined,
    };
    get needLogin() {
        return true;
    }

    constructor(isCreditMode = false) {
        super(html);
        Recharge.IsCreditMode = isCreditMode;

        if (Recharge.IsCreditMode) {
            this.model.title = textRes.items["信用资本"] + " " + textRes.items["充值"];
        }
        else {
            this.model.title = textRes.items["充值"];
        }

        this.model.textRes = textRes;
        this.model.tabs[0] = {
            text: textRes.items['法币充值'],
            selected: false,
            paneltype:"fiatrecharge",
        };
        this.model.tabs[1] = {
            text: textRes.items['币币充值'],
            selected: false,
            paneltype: "bbrecharge",
        };

        //移除法币充值
        if (Recharge.IsCreditMode) {
            this.model.tabs.splice(0, 1);            
        }
        this.model.tabs[0].selected = true;

        this.model.selectedTab = this.model.tabs.filter((item) => item.selected)[0];

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
        navigation.push(new BillList(8, Recharge.IsCreditMode));
    }

    tabClick(tab: TabItem) {
        this.model.selectedTab = tab;
        this.model.tabs.forEach((item) => {
            item.selected = item === tab;
        });
    }
}