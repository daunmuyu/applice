var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { AccountType, AccountApi } from "../../../ServerApis/AccountApi";
import { ModelValidator } from "jack-one-script";
import { showError } from "../../../Global";
import { MessageCenter, MessageType } from "../../../MessageCenter";
var html = require("./epayAccount.html");
var EPayAcount = /** @class */ (function (_super) {
    __extends(EPayAcount, _super);
    function EPayAcount() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            email: "",
            validator: {},
        };
        _this.bankType = AccountType.EPay;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(EPayAcount.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    EPayAcount.prototype.submit = function () {
        var _this = this;
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "email"
            }
        ], "validator")) {
            return;
        }
        this.model.isBusy = true;
        AccountApi.SetCollectMoney(this, undefined, this.model.email, undefined, this.bankType, 2, undefined, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                MessageCenter.raise(MessageType.BankAccountsChanged, null);
                navigation.pop();
            }
        });
    };
    return EPayAcount;
}(BaseComponent));
export { EPayAcount };
//# sourceMappingURL=EPayAcount.js.map