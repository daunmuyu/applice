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
import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { BalanceDetail } from "./BalanceDetail";
var html = require("./balanceList.html");
var BalanceList = /** @class */ (function (_super) {
    __extends(BalanceList, _super);
    function BalanceList() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            startDate: "2019-01-02",
            endDate: "2019-02-03",
            isBusy: false,
            /**1=保证金，2=余额，3=信用资本 */
            opType: undefined,
            types: [
                {
                    name: textRes.items['昨日收益'],
                    id: undefined,
                    detailClass: BalanceDetail,
                },
                {
                    name: textRes.items['保证金收益'],
                    id: 1,
                    detailClass: BalanceDetail,
                },
                {
                    name: textRes.items['余额收益'],
                    id: 2,
                    detailClass: BalanceDetail,
                },
                {
                    name: textRes.items['信用资本'],
                    id: 3,
                    detailClass: BalanceDetail,
                },
            ],
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        _this.model.textRes = textRes;
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
    Object.defineProperty(BalanceList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    BalanceList.prototype.getType = function (biztype) {
        var _this = this;
        return this.model.types.find(function (m) { return m.id == _this.model.opType; });
    };
    BalanceList.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    BalanceList.prototype.reload = function () {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
    };
    BalanceList.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy || this.model.hasMore == false)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.model.isBusy = true;
                        this.model.dataError = false;
                        if (this.model.pageNumber == 1) {
                            this.model.datas = [];
                            this.model.hasMore = true;
                        }
                        return [4 /*yield*/, AccountApi.GetFundDayBalanceTreasureInterestListPaged(this, this.model.opType, this.model.startDate, this.model.endDate, this.model.pageNumber, 18)];
                    case 2:
                        ret = _a.sent();
                        console.log(JSON.stringify(ret));
                        this.model.pageNumber++;
                        for (i = 0; i < ret.length; i++) {
                            this.model.datas.push(ret[i]);
                        }
                        this.model.hasMore = ret.length == 18;
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        this.model.dataError = true;
                        showError(e_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BalanceList.prototype.itemClick = function (item) {
        var _this = this;
        try {
            var type = this.model.types.find(function (m) { return m.id == _this.model.opType; });
            if (type && type.detailClass)
                navigation.push(new type.detailClass(item, this.model.opType));
        }
        catch (e) {
        }
    };
    BalanceList.prototype.loadMore = function () {
        this.loadData();
    };
    return BalanceList;
}(BaseComponent));
export { BalanceList };
//# sourceMappingURL=BalanceList.js.map