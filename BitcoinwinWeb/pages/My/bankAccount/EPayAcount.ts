import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { ApiHelper } from "../../../ServerApis/ApiHelper";
import { AccountType, AccountApi } from "../../../ServerApis/AccountApi";
import { ModelValidator, ValidateType } from "jack-one-script";
import { showError } from "../../../Global";
import { MessageCenter, MessageType } from "../../../MessageCenter";
var html = require("./epayAccount.html");
export class EPayAcount extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        email: "",
        validator: {},
    };
    bankType: AccountType = AccountType.EPay;

    get needLogin(){
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
    submit() {
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "email"
            }
        ], "validator")) {
            return;
        }
        this.model.isBusy = true;
        AccountApi.SetCollectMoney(this, undefined, this.model.email, undefined, this.bankType, 2, undefined, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                MessageCenter.raise(MessageType.BankAccountsChanged, null);

                navigation.pop();
            }
        });
    }
}