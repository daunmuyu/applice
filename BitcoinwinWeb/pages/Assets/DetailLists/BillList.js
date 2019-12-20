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
import { RechargeDetail } from "./RechargeDetail";
import { WithdrawDetail } from "./WithdrawDetail";
import { isArray } from "util";
import { BillDetail } from "./BillDetail";
import { FllowOrderDetail } from "./FllowOrderDetail";
var html = require("./billList.html");
var BillList = /** @class */ (function (_super) {
    __extends(BillList, _super);
    function BillList(optype, isCreditMode) {
        if (optype === void 0) { optype = undefined; }
        if (isCreditMode === void 0) { isCreditMode = false; }
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            startDate: "2019-01-02",
            endDate: "2019-02-03",
            isBusy: false,
            /**操作类型(8=充值，9=提现，7=平仓委托成交,1=开仓,12=隔夜利息,20=收益划转,36=借用信用金额,37=信用滞纳金,43=跟单亏损赔偿) */
            opType: undefined,
            isCreditMode: false,
            types: [
                {
                    name: textRes.items['全部'],
                    id: [12, 20, 39],
                },
                {
                    name: "",
                    id: 8,
                    f: "+",
                    color: textRes.items['TextColor涨'],
                    hasDetail: true,
                    detailClass: RechargeDetail,
                },
                {
                    name: "",
                    id: 9,
                    f: "-",
                    color: textRes.items['TextColor跌'],
                    hasDetail: true,
                    detailClass: WithdrawDetail,
                },
                //{
                //    name: textRes.items['平仓委托成交'],
                //    id: 7,
                //    f: "",
                //},
                //{
                //    name: textRes.items['开仓'],
                //    id: 1,
                //    f: "",
                //},
                {
                    name: textRes.items['隔夜利息'],
                    id: 12,
                    f: "-",
                    color: textRes.items['TextColor跌'],
                    hasDetail: false,
                },
                {
                    name: textRes.items['收益转入'],
                    id: [20, 39],
                    f: "+",
                    color: textRes.items['TextColor涨'],
                    hasDetail: false,
                },
                {
                    name: textRes.items['借款转入'],
                    id: 36,
                    f: "+",
                    color: textRes.items['TextColor涨'],
                    hasDetail: true,
                },
                {
                    name: textRes.items['日逾期利息'],
                    id: 37,
                    f: "-",
                    color: textRes.items['TextColor跌'],
                    hasDetail: true,
                },
                {
                    name: textRes.items['跟单亏损赔偿'],
                    id: 43,
                    f: "+",
                    color: textRes.items['TextColor涨'],
                    hasDetail: true,
                    detailClass: FllowOrderDetail,
                },
            ],
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        _this.model.textRes = textRes;
        _this.model.isCreditMode = isCreditMode;
        _this.model.types[1].name = isCreditMode ? textRes.items['充值信用资本'] : textRes.items['充值'];
        _this.model.types[2].name = isCreditMode ? textRes.items['提现信用资本'] : textRes.items['提现'];
        if (optype != undefined) {
            _this.model.types = _this.model.types.filter(function (m) { return m.id == optype; });
        }
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
    Object.defineProperty(BillList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BillList.prototype.getType = function (biztype) {
        var _this = this;
        if (!biztype)
            return this.model.types.find(function (m) { return m.id == _this.model.opType; });
        for (var i = this.model.types.length - 1; i >= 0; i--) {
            if (isArray(this.model.types[i].id) && this.model.types[i].id.indexOf(biztype) >= 0) {
                return this.model.types[i];
            }
            else if (this.model.types[i].id == biztype) {
                return this.model.types[i];
            }
        }
    };
    BillList.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    BillList.prototype.reload = function () {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
    };
    BillList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        if (this.model.opType == 8) {
            AccountApi.GetPayinList(this, this.model.isCreditMode ? 2 : 1, this.model.pageNumber, 18, function (ret, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = _this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.opType == 9) {
            AccountApi.GetPayOutList(this, this.model.isCreditMode ? 2 : 1, this.model.pageNumber, 18, function (ret, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = _this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetFundAccountMoneyFlowList(this, this.model.opType, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, totalIncome, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = _this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
    };
    BillList.prototype.itemClick = function (item) {
        if (!item.typeObj.hasDetail)
            return;
        var detailClass = item.typeObj.detailClass;
        if (!detailClass)
            detailClass = BillDetail;
        navigation.push(new detailClass(item, item.typeObj));
    };
    BillList.prototype.loadMore = function () {
        this.loadData();
    };
    return BillList;
}(BaseComponent));
export { BillList };
//# sourceMappingURL=BillList.js.map