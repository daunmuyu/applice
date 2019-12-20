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
var html = require("./creditFlowDetail.html");
var CreditFlowDetail = /** @class */ (function (_super) {
    __extends(CreditFlowDetail, _super);
    function CreditFlowDetail(itemtitle, f, amount, id, typeObj) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: false,
            data: {
                extData: {}
            },
            itemtitle: "",
            f: "",
            amount: 0,
            id: undefined,
            typeObj: {},
        };
        _this.model.itemtitle = itemtitle;
        _this.model.typeObj = typeObj;
        _this.model.amount = amount;
        _this.model.f = f;
        _this.model.id = id;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(CreditFlowDetail.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    CreditFlowDetail.prototype.onNavigationPushed = function () {
        var _this = this;
        _super.prototype.onNavigationPushed.call(this);
        this.model.isBusy = true;
        AccountApi.GetUserCoinFlowDetail(this, this.model.id, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                console.log(JSON.stringify(ret));
                _this.model.data = ret;
            }
        });
    };
    return CreditFlowDetail;
}(BaseComponent));
export { CreditFlowDetail };
//# sourceMappingURL=CreditFlowDetail.js.map