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
var html = require("./withdrawDetail.html");
var WithdrawDetail = /** @class */ (function (_super) {
    __extends(WithdrawDetail, _super);
    function WithdrawDetail(item, typeObj) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: false,
            data: {},
            typeObj: {},
        };
        console.log(JSON.stringify(item));
        _this.model.typeObj = typeObj;
        _this.model.textRes = textRes;
        _this.model.data = item;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(WithdrawDetail.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return WithdrawDetail;
}(BaseComponent));
export { WithdrawDetail };
//# sourceMappingURL=WithdrawDetail.js.map