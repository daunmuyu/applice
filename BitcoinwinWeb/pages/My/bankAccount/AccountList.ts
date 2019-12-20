import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { showError } from "../../../Global";
import { TextRes } from "../../../TextRes";
import { AccountApi, PayoutBank } from "../../../ServerApis/AccountApi";
import { BindingAccount } from "./BindingAccount";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import { confirmWindow } from "../../../GlobalFunc";

var html = require("./accountList.html");
export class AccountList extends BaseComponent {
    vm: Vue;
    currentItem: PayoutBank;
    model = {
        textRes: <TextRes>{},
        isBusy: false,

        datas: <PayoutBank[]>[],
    };
    checked = false;

    get needLogin() {
        return true;
    }

    private onBankAccountsChanged;
    constructor() {
        super(html);

        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        this.onBankAccountsChanged = (p) => {
            this.loadData();
        };
        MessageCenter.register(MessageType.BankAccountsChanged, this.onBankAccountsChanged );
    }

    longTouch(item: PayoutBank) {

        if (window.api) {
            window.api.actionSheet({
                cancelTitle: textRes.items['取消'],
                buttons: [textRes.items['编辑'], textRes.items['删除']]
            }, async (ret, err) => {
                if (ret.buttonIndex === 1) {
                    this.currentItem = item;
                    navigation.push(new BindingAccount());
                }
                else if (ret.buttonIndex === 2) {
                    if (await confirmWindow(textRes.items['确定删除吗？'])) {
                        this.deleteitem(item);
                    }
                }
            });
        }
        else {
            this.currentItem = item;
            navigation.push(new BindingAccount());
        }
    }

    async deleteitem(item: PayoutBank) {
        this.model.isBusy = true;
        try {
            await AccountApi.DeletePayoutBank(this, item.id);
            var index = this.model.datas.indexOf(item);
            if (index >= 0)
                this.model.datas.splice(index, 1);
        } catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }

    dispose() {
        MessageCenter.unRegister(MessageType.BankAccountsChanged, this.onBankAccountsChanged);
        super.dispose();
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.loadData();
    }

    loadData() {
        if (this.model.isBusy )
            return;

        this.model.isBusy = true;

        AccountApi.GetPayoutBanks(this, (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                showError(err);
            }
            else {
                this.model.datas = ret;
                if (ret.length == 0 && !this.checked) {
                    this.checked = true;
                    this.addClick();
                }
            }
        });
    }

    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);

        if (isResume && !this.model.isBusy && this.model.datas.length == 0) {
            navigation.pop(false);
        }
    }
    addClick() {
        this.currentItem = null;
        navigation.push(new BindingAccount());
    }
}