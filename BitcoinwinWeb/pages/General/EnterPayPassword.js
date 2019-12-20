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
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { SetPayPassword } from "../My/SetPayPassword";
var html = require("./enterPayPassword.html");
var EnterPayPassword = /** @class */ (function (_super) {
    __extends(EnterPayPassword, _super);
    function EnterPayPassword(title, canSetPwd, callback) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            password: "",
            title: "",
            isBusy: false,
            canSetPwd: false,
        };
        _this.model.canSetPwd = canSetPwd;
        _this.model.textRes = textRes;
        _this.model.title = title;
        if (!_this.model.title)
            _this.model.title = textRes.items["请输入支付密码"];
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                password: function (newvalue, oldvalue) {
                    callback(newvalue);
                }
            }
        });
        return _this;
    }
    Object.defineProperty(EnterPayPassword.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    EnterPayPassword.prototype.emptyClick = function () {
    };
    EnterPayPassword.prototype.documentClick = function () {
        navigation.pop(false);
    };
    EnterPayPassword.prototype.setPwdClick = function () {
        navigation.push(new SetPayPassword());
    };
    EnterPayPassword.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.element.querySelector("INPUT[_numberpanel]").focus();
    };
    return EnterPayPassword;
}(BaseComponent));
export { EnterPayPassword };
//# sourceMappingURL=EnterPayPassword.js.map