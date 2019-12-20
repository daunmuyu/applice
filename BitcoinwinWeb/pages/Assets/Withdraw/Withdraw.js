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
import { CreditAccount } from "../CreditAccount";
import { BillList } from "../DetailLists/BillList";
import { Home } from "../../Home";
var html = require("./withdraw.html");
var Tab = /** @class */ (function () {
    function Tab() {
    }
    return Tab;
}());
var Withdraw = /** @class */ (function (_super) {
    __extends(Withdraw, _super);
    function Withdraw(isCreditMode) {
        if (isCreditMode === void 0) { isCreditMode = false; }
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            tabs: [],
            isBusy: false,
            title: undefined,
        };
        Withdraw.IsCreditMode = isCreditMode;
        if (Withdraw.IsCreditMode) {
            _this.model.title = textRes.items["信用资本"] + " " + textRes.items["提现"];
        }
        else {
            _this.model.title = textRes.items["提现"];
        }
        _this.model.textRes = textRes;
        _this.model.tabs[0] = new Tab();
        _this.model.tabs[0].title = textRes.items["法币提现"];
        _this.model.tabs[0].paneltype = "fiatwithdraw";
        _this.model.tabs[0].selected = false;
        if (!isCreditMode || (CreditAccount.CreditInfo.items && CreditAccount.CreditInfo.items.filter(function (m) { return m.coinNum; }).length)) {
            _this.model.tabs[1] = new Tab();
            _this.model.tabs[1].title = textRes.items["币币提现"];
            _this.model.tabs[1].paneltype = "bbwithdraw";
            _this.model.tabs[1].selected = false;
        }
        //移除法币提现
        if (isCreditMode) {
            _this.model.tabs.splice(0, 1);
        }
        _this.model.tabs[0].selected = true;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Withdraw.prototype.helpClick = function () {
        Home.instance.contactUsClick();
    };
    Withdraw.prototype.billList = function () {
        navigation.push(new BillList(9, Withdraw.IsCreditMode));
    };
    Withdraw.prototype.tabClick = function (tab) {
        this.model.tabs.forEach(function (item) {
            item.selected = (item === tab);
        });
    };
    /**当前是否是信用提现的环境 */
    Withdraw.IsCreditMode = false;
    return Withdraw;
}(BaseComponent));
export { Withdraw };
//# sourceMappingURL=Withdraw.js.map