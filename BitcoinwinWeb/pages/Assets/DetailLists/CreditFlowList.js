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
import { isArray } from "util";
import { CreditFlowDetail } from "./CreditFlowDetail";
var html = require("./creditFlowList.html");
var CreditFlowList = /** @class */ (function (_super) {
    __extends(CreditFlowList, _super);
    function CreditFlowList() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            startDate: "2019-01-02",
            endDate: "2019-02-03",
            isBusy: false,
            /**操作类型1=借用信用金额, 2= 还信用金额, 3= 充值, 4= 提现, 5= 数字货币还款 */
            opType: undefined,
            types: [],
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
            title: "",
        };
        _this.model.title = textRes.items["明细"];
        _this.model.textRes = textRes;
        _this.model.types = _this.types;
        _this.model.opType = _this.model.types[0].id;
        var now = new Date();
        _this.model.startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).Format("yyyy-MM-dd");
        _this.model.endDate = now.Format("yyyy-MM-dd");
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
            watch: {
                startDate: function () { return _this.reload(); },
                endDate: function () { return _this.reload(); },
                opType: function () { return _this.reload(); },
            },
        });
        return _this;
    }
    Object.defineProperty(CreditFlowList.prototype, "types", {
        get: function () {
            return [
                {
                    name: textRes.items['全部'],
                    id: [1, 2, 6, 7],
                },
                {
                    name: textRes.items['借款'],
                    id: 1,
                    f: "+",
                    color: textRes.items['TextColor涨'],
                },
                {
                    name: textRes.items['还款'],
                    id: [2, 6, 7],
                    f: "-",
                    color: textRes.items['TextColor跌'],
                },
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreditFlowList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    CreditFlowList.prototype.getType = function (typeid) {
        var _this = this;
        if (!typeid)
            return this.model.types.find(function (m) { return m.id == _this.model.opType; });
        for (var i = this.model.types.length - 1; i >= 0; i--) {
            if (isArray(this.model.types[i].id) && this.model.types[i].id.indexOf(typeid) >= 0) {
                return this.model.types[i];
            }
            else if (this.model.types[i].id == typeid) {
                return this.model.types[i];
            }
        }
    };
    CreditFlowList.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    CreditFlowList.prototype.reload = function () {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
    };
    CreditFlowList.prototype.itemClick = function (item) {
        if (!item.typeObj.detailClass)
            navigation.push(new CreditFlowDetail(item.typeObj.name, item.typeObj.f, item.amount, item.id, item.typeObj));
        else
            navigation.push(new item.typeObj.detailClass(item, item.typeObj));
    };
    CreditFlowList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        var optype = this.model.opType;
        AccountApi.GetUserCoinFlowList(this, optype, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, err) {
            _this.model.isBusy = false;
            if (err) {
                _this.model.dataError = true;
                showError(err);
            }
            else {
                console.debug(JSON.stringify(ret));
                _this.model.pageNumber++;
                for (var i = 0; i < ret.length; i++) {
                    ret[i].typeObj = _this.getType(ret[i].opType);
                    _this.model.datas.push(ret[i]);
                }
                _this.model.hasMore = ret.length == 18;
            }
        });
    };
    CreditFlowList.prototype.loadMore = function () {
        this.loadData();
    };
    return CreditFlowList;
}(BaseComponent));
export { CreditFlowList };
//# sourceMappingURL=CreditFlowList.js.map