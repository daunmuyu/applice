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
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
var html = require("./shareInComeDetail.html");
var ShareInComeDetail = /** @class */ (function (_super) {
    __extends(ShareInComeDetail, _super);
    function ShareInComeDetail(title, date, id, amount, level) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: false,
            date: undefined,
            id: undefined,
            level: undefined,
            data: {},
            amount: undefined,
            title: null,
        };
        _this.model.title = title;
        _this.model.textRes = textRes;
        _this.model.date = date;
        _this.model.level = level;
        _this.model.id = id;
        _this.model.amount = amount;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(ShareInComeDetail.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ShareInComeDetail.prototype.loadData = function () {
        var _this = this;
        this.model.isBusy = true;
        if (this.model.level) {
            console.log(this.model.level + " ==> " + this.model.date);
            AccountApi.GetTotalFundDayDistributionIncomeDetail(this, this.model.level, this.model.date, function (ret, err) {
                _this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    console.log(ret);
                    _this.model.data = ret;
                }
            });
        }
        else {
            AccountApi.GetFundDayTotalIncomeDetail(this, this.model.id, function (ret, err) {
                _this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    console.log(ret);
                    _this.model.data = ret;
                }
            });
        }
    };
    ShareInComeDetail.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    return ShareInComeDetail;
}(BaseComponent));
export { ShareInComeDetail };
//# sourceMappingURL=shareInComeDetail.js.map