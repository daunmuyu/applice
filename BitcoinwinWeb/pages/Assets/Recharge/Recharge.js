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
import { BillList } from "../DetailLists/BillList";
import { Home } from "../../Home";
var html = require("./recharge.html");
var Recharge = /** @class */ (function (_super) {
    __extends(Recharge, _super);
    function Recharge(isCreditMode) {
        if (isCreditMode === void 0) { isCreditMode = false; }
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            tabs: [],
            selectedTab: null,
            title: undefined,
        };
        Recharge.IsCreditMode = isCreditMode;
        if (Recharge.IsCreditMode) {
            _this.model.title = textRes.items["信用资本"] + " " + textRes.items["充值"];
        }
        else {
            _this.model.title = textRes.items["充值"];
        }
        _this.model.textRes = textRes;
        _this.model.tabs[0] = {
            text: textRes.items['法币充值'],
            selected: false,
            paneltype: "fiatrecharge",
        };
        _this.model.tabs[1] = {
            text: textRes.items['币币充值'],
            selected: false,
            paneltype: "bbrecharge",
        };
        //移除法币充值
        if (Recharge.IsCreditMode) {
            _this.model.tabs.splice(0, 1);
        }
        _this.model.tabs[0].selected = true;
        _this.model.selectedTab = _this.model.tabs.filter(function (item) { return item.selected; })[0];
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(Recharge.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Recharge.prototype.helpClick = function () {
        Home.instance.contactUsClick();
    };
    Recharge.prototype.billList = function () {
        navigation.push(new BillList(8, Recharge.IsCreditMode));
    };
    Recharge.prototype.tabClick = function (tab) {
        this.model.selectedTab = tab;
        this.model.tabs.forEach(function (item) {
            item.selected = item === tab;
        });
    };
    Recharge.IsCreditMode = false;
    return Recharge;
}(BaseComponent));
export { Recharge };
//# sourceMappingURL=Recharge.js.map