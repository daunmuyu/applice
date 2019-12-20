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
import { AccountApi, UserMessageType } from "../../ServerApis/AccountApi";
import { MessageDetail } from "./MessageDetail";
var html = require("./messageList.html");
var MessageList = /** @class */ (function (_super) {
    __extends(MessageList, _super);
    function MessageList(msgtype) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            title: "",
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        _this.model.textRes = textRes;
        _this.msgType = msgtype;
        if (msgtype == UserMessageType.ActivityMsg) {
            _this.model.title = textRes.items["活动消息"];
        }
        else if (msgtype == UserMessageType.UserMsg) {
            _this.model.title = textRes.items["用户消息"];
        }
        else if (msgtype == UserMessageType.SystemMsg) {
            _this.model.title = textRes.items["系统消息"];
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                moretext: function () {
                    if (_this.model.dataError)
                        return textRes.items["点击重新加载"];
                    else if (_this.model.isBusy)
                        return textRes.items["正在加载"] + "...";
                    else if (_this.model.hasMore)
                        return textRes.items["加载更多"];
                    else if (_this.model.datas.length == 0)
                        return textRes.items["目前还没有数据"];
                    else
                        return textRes.items["没有更多数据了"];
                },
            },
        });
        return _this;
    }
    Object.defineProperty(MessageList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MessageList.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    MessageList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        AccountApi.GetUserMessageList(this, this.msgType, this.model.pageNumber, 30, function (ret, err) {
            _this.model.isBusy = false;
            if (err) {
                _this.model.dataError = true;
                showError(err);
            }
            else {
                _this.model.pageNumber++;
                for (var i = 0; i < ret.length; i++) {
                    _this.model.datas.push(ret[i]);
                }
                _this.model.hasMore = ret.length == 30;
            }
        });
    };
    MessageList.prototype.loadMore = function () {
        this.loadData();
    };
    MessageList.prototype.itemClick = function (item) {
        navigation.push(new MessageDetail(this.model.title, item));
    };
    return MessageList;
}(BaseComponent));
export { MessageList };
//# sourceMappingURL=MessageList.js.map