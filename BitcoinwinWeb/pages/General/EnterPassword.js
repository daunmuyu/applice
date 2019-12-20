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
var html = require("./enterPassword.html");
var EnterPassword = /** @class */ (function (_super) {
    __extends(EnterPassword, _super);
    function EnterPassword(callback) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            password: "",
            err: false,
        };
        _this.model.textRes = textRes;
        _this.callback = callback;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(EnterPassword.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnterPassword.prototype, "animationOnNavigation", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    EnterPassword.prototype.emptyClick = function () {
    };
    EnterPassword.prototype.ok = function () {
        if (this.model.password) {
            this.model.err = false;
            navigation.pop(false);
            this.callback(this.model.password);
        }
        else {
            this.model.err = true;
        }
    };
    EnterPassword.prototype.documentClick = function () {
        navigation.pop(false);
    };
    EnterPassword.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.element.querySelector("INPUT[_numberpanel]").focus();
    };
    return EnterPassword;
}(BaseComponent));
export { EnterPassword };
//# sourceMappingURL=EnterPassword.js.map