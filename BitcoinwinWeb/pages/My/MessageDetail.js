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
import { showError } from "../../Global";
import { AccountApi } from "../../ServerApis/AccountApi";
var html = require("./messageDetail.html");
var MessageDetail = /** @class */ (function (_super) {
    __extends(MessageDetail, _super);
    function MessageDetail(title, msg) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            title: "",
            msgitem: null,
        };
        _this.model.textRes = textRes;
        _this.model.msgitem = msg;
        _this.model.title = title;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(MessageDetail.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MessageDetail.prototype.onNavigationPushed = function () {
        var _this = this;
        _super.prototype.onNavigationPushed.call(this);
        this.model.isBusy = true;
        AccountApi.GetUserMessage(this, this.model.msgitem.id, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                _this.model.msgitem.status = 1;
                _this.model.msgitem.content = ret.content;
            }
        });
    };
    return MessageDetail;
}(BaseComponent));
export { MessageDetail };
//# sourceMappingURL=MessageDetail.js.map