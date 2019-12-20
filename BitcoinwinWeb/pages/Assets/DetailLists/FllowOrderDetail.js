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
var html = require("./fllowOrderDetail.html");
/**带单包赔 明细 详情页面 */
var FllowOrderDetail = /** @class */ (function (_super) {
    __extends(FllowOrderDetail, _super);
    function FllowOrderDetail(item) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: false,
            item: undefined,
        };
        _this.model.item = item;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(FllowOrderDetail.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return FllowOrderDetail;
}(BaseComponent));
export { FllowOrderDetail };
//# sourceMappingURL=FllowOrderDetail.js.map