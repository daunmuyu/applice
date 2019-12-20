import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
var html = require("./bindingAccount.html");
class AccountType {
    title: string;
    paneltype: string;
    selected: boolean;
    bankType: number;
}

export class BindingAccount extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        types: <AccountType[]>[],
        selectedType:"",
        isBusy:false,
    };
    constructor() {
        super(html);

        this.model.textRes = textRes;
        this.model.types[0] = new AccountType();
        this.model.types[0].title = textRes.items["银行卡账户"];
        this.model.types[0].paneltype = "bankaccount";
        this.model.types[0].selected = true;
        this.model.types[0].bankType = 2;

        //this.model.types[1] = new AccountType();
        //this.model.types[1].title = textRes.items["EPay账户"];
        //this.model.types[1].paneltype = "epayacount";
        //this.model.types[1].selected = false;
        //this.model.types[1].bankType = 4;

        this.model.selectedType = this.model.types.find(m => m.selected).title;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                selectedType: (newValue) => {
                    this.model.types.forEach(m => m.selected = m.title === newValue);
                },
            },
        });
    }
   
}