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
import { BaseComponent } from "../BaseComponent";
import Vue from "vue";
import { showError } from "../Global";
import { AccountApi } from "../ServerApis/AccountApi";
var html = require("./hongBao.html");
var HongBao = /** @class */ (function (_super) {
    __extends(HongBao, _super);
    function HongBao() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            /**1:显示红包 2：拆开红包 */
            status: 1,
            isBusy: 0,
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(HongBao.prototype, "animationOnNavigation", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    HongBao.prototype.openHongBao = function () {
        var _this = this;
        if (this.model.isBusy)
            return;
        this.model.isBusy++;
        AccountApi.ReceiveRedEnvelope(this, function (ret, err) {
            _this.model.isBusy--;
            if (err)
                showError(err);
            else {
                _this.model.status = 2;
            }
        });
    };
    HongBao.prototype.close = function () {
        navigation.pop(false);
    };
    return HongBao;
}(BaseComponent));
export { HongBao };
//# sourceMappingURL=HongBao.js.map