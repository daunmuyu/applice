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
var html = require("./bindingAccount.html");
var AccountType = /** @class */ (function () {
    function AccountType() {
    }
    return AccountType;
}());
var BindingAccount = /** @class */ (function (_super) {
    __extends(BindingAccount, _super);
    function BindingAccount() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            types: [],
            selectedType: "",
            isBusy: false,
        };
        _this.model.textRes = textRes;
        _this.model.types[0] = new AccountType();
        _this.model.types[0].title = textRes.items["银行卡账户"];
        _this.model.types[0].paneltype = "bankaccount";
        _this.model.types[0].selected = true;
        _this.model.types[0].bankType = 2;
        //this.model.types[1] = new AccountType();
        //this.model.types[1].title = textRes.items["EPay账户"];
        //this.model.types[1].paneltype = "epayacount";
        //this.model.types[1].selected = false;
        //this.model.types[1].bankType = 4;
        _this.model.selectedType = _this.model.types.find(function (m) { return m.selected; }).title;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                selectedType: function (newValue) {
                    _this.model.types.forEach(function (m) { return m.selected = m.title === newValue; });
                },
            },
        });
        return _this;
    }
    return BindingAccount;
}(BaseComponent));
export { BindingAccount };
//# sourceMappingURL=BindingAccount.js.map