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
var html = require("./confirmWindow.html");
var ConfirmWindow = /** @class */ (function (_super) {
    __extends(ConfirmWindow, _super);
    function ConfirmWindow(captions, contents, callback) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            captions: [],
            contents: [],
        };
        _this.model.captions = captions;
        _this.model.contents = contents;
        _this.model.textRes = textRes;
        _this.callback = callback;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(ConfirmWindow.prototype, "animationOnNavigation", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfirmWindow.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ConfirmWindow.prototype.emptyClick = function () {
    };
    ConfirmWindow.prototype.submit = function () {
        navigation.pop(false);
        if (this.callback)
            this.callback();
    };
    ConfirmWindow.prototype.documentClick = function () {
        navigation.pop(false);
    };
    return ConfirmWindow;
}(BaseComponent));
export { ConfirmWindow };
//# sourceMappingURL=ConfirmWindow.js.map