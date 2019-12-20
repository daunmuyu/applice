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
var html = require("./alertWindow.html");
var AlertWindow = /** @class */ (function (_super) {
    __extends(AlertWindow, _super);
    function AlertWindow() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: textRes,
            title: undefined,
            content: undefined,
            isBusy: 0,
            textAlign: "left",
            buttons: [],
        };
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            methods: _this.getMethodObjectForVue(),
            data: _this.model
        });
        return _this;
    }
    Object.defineProperty(AlertWindow.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    AlertWindow.prototype.itemClick = function (btn) {
        this.dispose();
        if (btn.action) {
            try {
                btn.action();
            }
            catch (e) {
            }
        }
    };
    AlertWindow.prototype.bodyClick = function () {
        if (this.bodyClickCallback)
            this.bodyClickCallback();
    };
    return AlertWindow;
}(BaseComponent));
export { AlertWindow };
//# sourceMappingURL=AlertWindow.js.map