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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { AccountApi } from "../../ServerApis/AccountApi";
import { Home } from "../Home";
import { shareImageReview } from "../../GlobalFunc";
var html = require("./tradeHistory.html");
var TradeHistory = /** @class */ (function (_super) {
    __extends(TradeHistory, _super);
    function TradeHistory() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            isBusy: false,
            isDemoMode: false,
            textRes: {},
            datas: [],
            types: [],
            opType: undefined,
            pageNumber: 1,
            hasMore: true,
            dataError: false,
            showFilter: true,
        };
        if (Home.AccountInfo && Home.AccountInfo.accountMoneyInfo.isAllowDocumentary == false)
            _this.model.showFilter = false;
        var textRes = _this.model.textRes = window.textRes;
        _this.model.isDemoMode = ApiHelper.IsDemoMode;
        _this.model.types.push({ id: undefined, name: _this.model.textRes.items['全部'] });
        _this.model.types.push({ id: 2, name: _this.model.textRes.items['自动跟单'] });
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
                opType: function (newValue) {
                    _this.model.pageNumber = 1;
                    _this.model.hasMore = true;
                    _this.loadData();
                }
            }
        });
        return _this;
    }
    TradeHistory.prototype.share = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var url, e_1, ret, e_2, symbolname, module;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (item.isBusy)
                            return [2 /*return*/];
                        this.recordAction("TradeHistory_分享");
                        item.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 7]);
                        url = encodeURIComponent(Home.AccountInfo.accountMoneyInfo.registerurl);
                        return [3 /*break*/, 7];
                    case 2:
                        e_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 4:
                        ret = _a.sent();
                        Home.AccountInfo = ret;
                        url = encodeURIComponent(ret.accountMoneyInfo.registerurl);
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        showError(e_2);
                        item.isBusy = false;
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        symbolname = item.symbolname.split('/')[1];
                        if (!symbolname)
                            symbolname = item.symbolname;
                        module = window.api.require('kLine');
                        console.log(ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/SharePosition.html?currency=" + symbolname + "&bstype=" + item.bstype + "&profitRate=" + item.profitRate + "&profit=&newprice=" + item.newprice + "&buyprice=" + item.buyprice + "&url=" + url);
                        module.saveWebImage({
                            w: 1043,
                            h: 1854,
                            waitForReady: true,
                            url: ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/SharePosition.html?currency=" + symbolname + "&bstype=" + item.bstype + "&profitRate=" + item.profitRate + "&profit=&newprice=" + item.newprice + "&buyprice=" + item.buyprice + "&url=" + url,
                        }, function (ret, err) {
                            if (!_this.actived)
                                return;
                            if (err) {
                                item.isBusy = false;
                                if (_this.actived)
                                    showError("timeout");
                            }
                            else if (ret.status == 1) {
                                item.isBusy = false;
                                if (_this.actived)
                                    shareImageReview(ret.data);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TradeHistory.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    TradeHistory.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        TradeApi.GetTradeDetailList(this, this.model.pageNumber, 20, this.model.opType, function (ret, err) {
            _this.model.isBusy = false;
            if (err) {
                _this.model.dataError = true;
                showError(err);
            }
            else {
                _this.model.pageNumber++;
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].isBusy = false;
                    _this.model.datas.push(ret.list[i]);
                }
                _this.model.hasMore = ret.list.length == 20;
            }
        });
    };
    TradeHistory.prototype.loadMore = function () {
        this.loadData();
    };
    return TradeHistory;
}(BaseComponent));
export { TradeHistory };
//# sourceMappingURL=TradeHistory.js.map