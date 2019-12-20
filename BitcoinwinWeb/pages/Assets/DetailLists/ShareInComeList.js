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
import { Home } from "../../Home";
var html = require("./shareInComeList.html");
var ShareInComeList = /** @class */ (function (_super) {
    __extends(ShareInComeList, _super);
    function ShareInComeList(listTotal, pageTotal) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            startDate: "2019-01-02",
            endDate: "2019-02-03",
            isBusy: false,
            totalIncome: undefined,
            level: undefined,
            types: [
                {
                    name: textRes.items['昨日收益'],
                    level: undefined,
                },
                {
                    name: textRes.items['分享好友收获'],
                    level: 1,
                    isDistributionTradeIncomeList: false,
                },
                {
                    name: textRes.items['好友分享获赠'],
                    level: 2,
                }
            ],
            listTotal: undefined,
            pageTotal: undefined,
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        if (Home.AccountInfo && Home.AccountInfo.isVip) {
            _this.model.types.push({
                name: textRes.items['手续费返佣收益'],
                level: 100,
            });
            _this.model.types.push({
                name: textRes.items['首次入金奖励'],
                level: 101,
            });
        }
        _this.model.textRes = textRes;
        _this.model.listTotal = listTotal;
        _this.model.pageTotal = pageTotal;
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
                currentTypeName: function () {
                    return _this.model.types.find(function (m) { return m.level == _this.model.level; }).name;
                },
            },
            watch: {
                startDate: function () { return _this.reload(); },
                endDate: function () { return _this.reload(); },
                level: function () { return _this.reload(); },
            },
        });
        return _this;
    }
    Object.defineProperty(ShareInComeList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ShareInComeList.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    ShareInComeList.prototype.reload = function () {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
    };
    ShareInComeList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        if (this.model.level == 100) {
            //手续费返佣列表
            AccountApi.GetTotalFundDistributionTradeIncomeListPaged(this, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, totalIncome, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.totalIncome = totalIncome;
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.level == 101) {
            /*
             {"flowid":1691,"fundaccountid":8000041,"biztime":"2019-05-29 07:58:21","biztype":33,
             "bizname":"用户首冲赠送分销用户","currenttype":"USDT","amount":10,"objectid":"8000042","canusedamount":10,
             "orderno":0,"contractid":0,"quantity":0,"tradefee":0,"margin":0,"profit":0,
             "symbol":null,"marketsymbol":null,"leverage":null,"financingamount":0,"extdata":null,"extData":{}}]
             */
            AccountApi.GetFundAccountMoneyFlowList(this, 33, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, totalIncome, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    _this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.level) {
            AccountApi.GetTotalFundDayDistributionIncomeListPaged(this, this.model.level, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, totalIncome, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    _this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetFundDayTotalIncomeListPaged(this, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, totalIncome, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    _this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
    };
    ShareInComeList.prototype.detail = function (date, id, amount) {
        //if (this.model.level != 101)
        //    navigation.push(new ShareInComeDetail((<any>this.vm).currentTypeName, date, id, amount, this.model.level));
    };
    ShareInComeList.prototype.loadMore = function () {
        this.loadData();
    };
    return ShareInComeList;
}(BaseComponent));
export { ShareInComeList };
//# sourceMappingURL=ShareInComeList.js.map