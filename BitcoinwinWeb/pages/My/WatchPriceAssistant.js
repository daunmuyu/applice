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
import { showError } from "../../Global";
import { TradeApi } from "../../ServerApis/TradeApi";
import { WatchPriceAssistantEditor } from "./WatchPriceAssistantEditor";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../../MessageCenter";
var html = require("./watchPriceAssistant.html");
var WatchPriceAssistant = /** @class */ (function (_super) {
    __extends(WatchPriceAssistant, _super);
    function WatchPriceAssistant() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: 0,
            list: [],
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        _this.InsertWatchPriceAction = function (p) {
            p.expanded = true;
            _this.model.list.forEach(function (m) { return m.expanded = false; });
            _this.model.list.push(p);
        };
        MessageCenter.register(MessageType.InsertWatchPrice, _this.InsertWatchPriceAction);
        return _this;
    }
    WatchPriceAssistant.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadList();
    };
    WatchPriceAssistant.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        MessageCenter.unRegister(MessageType.InsertWatchPrice, this.InsertWatchPriceAction);
    };
    WatchPriceAssistant.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        MessageCenter.raise(MessageType.StartRefreshQuotation, null);
    };
    WatchPriceAssistant.prototype.onNavigationUnActived = function (ispop) {
        _super.prototype.onNavigationUnActived.call(this, ispop);
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    };
    /**
     * 判断item是否包含指定的subitemtype
     * @param item
     * @param subtypes
     */
    WatchPriceAssistant.prototype.hasSubitmeType = function (item, subtypes) {
        var subItems = item.subItems;
        return subItems.some(function (m) { return m.enable && subtypes.some(function (t) { return t == m.type; }); });
    };
    WatchPriceAssistant.prototype.getSubitemValue = function (item, type) {
        var subItems = item.subItems;
        var subitem = subItems.find(function (m) { return m.enable && m.type == type; });
        if (subitem)
            return subitem.value;
        return undefined;
    };
    WatchPriceAssistant.prototype.modify = function (item) {
        navigation.push(new WatchPriceAssistantEditor(item));
    };
    WatchPriceAssistant.prototype.deleteItem = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm(textRes.items['确定删除吗？'])) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.model.isBusy++;
                        return [4 /*yield*/, TradeApi.RemoveMarketWatch(this, item.id)];
                    case 2:
                        _a.sent();
                        this.model.list.splice(this.model.list.indexOf(item), 1);
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        showError(e_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WatchPriceAssistant.prototype.addClick = function () {
        navigation.push(new WatchPriceAssistantEditor());
    };
    WatchPriceAssistant.prototype.loadList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        this.model.isBusy++;
                        _a = WatchPriceAssistant;
                        return [4 /*yield*/, TradeApi.GetMarketWatchList(this)];
                    case 1:
                        _a.CurrentList = _b.sent();
                        if (WatchPriceAssistant.CurrentList.length == 0) {
                            navigation.push(new WatchPriceAssistantEditor(undefined), false);
                            navigation.unloadComponent(this);
                        }
                        else {
                            WatchPriceAssistant.CurrentList.forEach(function (m) {
                                m.expanded = false;
                                var subItems = m.subItems;
                                subItems.forEach(function (m) {
                                    if (m.type > 2) {
                                        m.value = parseFloat(m.value) * 100 + "";
                                    }
                                });
                                var commodity = ApiHelper.getDescriptionByMarketSymbol(m.symbol);
                                m.commodity = commodity;
                                if (!commodity)
                                    m.commodity = {};
                            });
                            this.model.list = WatchPriceAssistant.CurrentList;
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        e_2 = _b.sent();
                        showError(e_2);
                        return [3 /*break*/, 4];
                    case 3:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WatchPriceAssistant.CurrentList = [];
    return WatchPriceAssistant;
}(BaseComponent));
export { WatchPriceAssistant };
//# sourceMappingURL=WatchPriceAssistant.js.map