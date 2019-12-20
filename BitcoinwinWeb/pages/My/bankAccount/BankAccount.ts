import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { ApiHelper } from "../../../ServerApis/ApiHelper";
import { AccountApi, Bank, AccountType, PayoutBank } from "../../../ServerApis/AccountApi";
import { showError, clone } from "../../../Global";
import { ModelValidate, ModelValidator, ValidateType } from "jack-one-script";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import { AccountList } from "./AccountList";
var html = require("./bankAccount.html");
export class BankAccount extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        banks: <Bank[]>[],
        selectedBankId: undefined,
        validator: {
            item: {}
        },
        item: <PayoutBank>{
            id: null,
            bankName: "",
            bankNo: "",
            bankType: 2,
            coinAddress: null,
            openBank: "",
            realName:""
        }
    };

    get needLogin(){
        return true;
    }
    constructor() {
        super(html);

        this.model.textRes = textRes;
        if (ApiHelper.CurrentTokenInfo) {
            this.model.item.realName = ApiHelper.CurrentTokenInfo.realname;
        }

       

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                selectedBankName: () => {
                    var item = this.model.banks.find(m => m.id === this.model.selectedBankId);
                    if (!item)
                        return "";
                    return item.bankName;
                }
            },
        });

        
        AccountApi.GetBankList(this, (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                ret.splice(0, 0, <Bank>{ bankName: "", id: undefined });
                this.model.banks = ret;

                var modifyItem = clone((<AccountList>navigation.queue.find(m => m.constructor === AccountList)).currentItem);
                if (modifyItem) {
                    this.model.item = modifyItem;
                    try {
                        this.model.selectedBankId = ret.find(m => m.bankName == this.model.item.bankName).id;
                    } catch (e) {

                    }
                }
               
                
            }
        });
    }

    async submit() {
        try {
            if (!ModelValidator.verifyToProperty(this.model, [
                {
                    propertyName: "selectedBankId",
                },
                {
                    propertyName: "item.openBank"
                },
                {
                    propertyName: "item.bankNo"
                }
            ], "validator")) {
                return;
            }
           
        } catch (e) {
            alert(e.message);
            return;
        }
       
        var bankitem = this.model.banks.find(m => m.id === this.model.selectedBankId);
        this.model.item.bankName = bankitem.bankName;
        this.model.isBusy = true;
        if (this.model.item.id) {
            try {
                await AccountApi.UpdatePayoutBank(this, this.model.item);
                var currentItem = (<AccountList>navigation.queue.find(m => m.constructor === AccountList)).currentItem;
                for (var p in this.model.item) {
                    currentItem[p] = this.model.item[p];
                }
                navigation.pop();
            } catch (e) {
                showError(e);
            }
            finally {
                this.model.isBusy = false;
            }
        }
        else {

            AccountApi.SetCollectMoney(this, this.model.item.realName, this.model.item.bankNo, this.model.item.openBank, this.model.item.bankType, 2, this.model.item.bankName, (ret, err) => {
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
}