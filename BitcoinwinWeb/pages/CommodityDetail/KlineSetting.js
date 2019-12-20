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
import { alertWindow, getCache, setCache } from "../../GlobalFunc";
var html = require("./klineSetting.html");
var KLineOptionSettingKeyName = "klineOptionSetting";
var defaultMaColors = ["#35c8b1", "#e7b574", "#cf16d2", "#647DCF", "#F3A365", "#E2626E"];
var KlineSetting = /** @class */ (function (_super) {
    __extends(KlineSetting, _super);
    function KlineSetting(detailPage) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            tabs: [
                { text: "MA", selected: true },
                { text: "BOLL", selected: false },
                { text: "MACD", selected: false },
                { text: "KDJ", selected: false },
                { text: "RSI", selected: false },
                { text: "WR", selected: false }
            ],
            option: {},
            isBusy: false,
        };
        _this.detailPage = detailPage;
        _this.model.textRes = textRes;
        if (getCache(KLineOptionSettingKeyName)) {
            _this.model.option = JSON.parse(getCache(KLineOptionSettingKeyName));
        }
        var defaultOption = KlineSetting.defaultOption;
        for (var p in defaultOption) {
            if (_this.model.option[p] === undefined) {
                _this.model.option[p] = defaultOption[p];
            }
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                selectedTab: function () {
                    return _this.model.tabs.find(function (m) { return m.selected; });
                },
                selectedMaText: function () {
                    var ret = "";
                    for (var i = 0; i < _this.model.option.maItemSelects.length; i++) {
                        if (_this.model.option.maItemSelects[i] && _this.model.option.maItems[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "MA" + _this.model.option.maItems[i];
                        }
                    }
                    return ret;
                },
                selectedBollText: function () {
                    return "N" + _this.model.option.boll_n + "&nbsp;&nbsp;&nbsp;&nbsp;K" + _this.model.option.boll_k;
                },
                selectedMacdText: function () {
                    return "MACD(" + _this.model.option.macd_s + "," + _this.model.option.macd_l + "," + _this.model.option.macd_m + ")";
                },
                selectedRsiText: function () {
                    var ret = "";
                    for (var i = 0; i < _this.model.option.rsiSelects.length; i++) {
                        if (_this.model.option.rsiSelects[i] && _this.model.option.rsi_N[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "N" + _this.model.option.rsi_N[i];
                        }
                    }
                    return ret;
                },
                selectedWrText: function () {
                    var ret = "";
                    for (var i = 0; i < _this.model.option.wrSelects.length; i++) {
                        if (_this.model.option.wrSelects[i] && _this.model.option.wr_N[i]) {
                            if (ret.length > 0)
                                ret += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            ret += "N" + _this.model.option.wr_N[i];
                        }
                    }
                    return ret;
                },
            }
        });
        return _this;
    }
    Object.defineProperty(KlineSetting.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlineSetting, "defaultOption", {
        get: function () {
            return {
                maItems: ["5", "10", "30", "", "", ""],
                maItemSelects: [true, true, true, false, false, false],
                boll_n: 20,
                boll_k: 2,
                macd_s: 12,
                macd_l: 26,
                macd_m: 9,
                kdj_cycle: 9,
                rsi_N: ["6", "12", "24"],
                rsiSelects: [true, true, true],
                wr_N: ["10", "6"],
                wrSelects: [true, true],
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlineSetting, "lineViewOption", {
        /** 根据用户设置，获取k线指标设置值 */
        get: function () {
            var option = getCache(KLineOptionSettingKeyName);
            if (option) {
                option = JSON.parse(option);
            }
            else {
                option = {};
            }
            //ma相关
            if (option.maItemSelects) {
                var maItems = [];
                option.maColors = [];
                for (var i = 0; i < option.maItemSelects.length; i++) {
                    if (option.maItemSelects[i] && option.maItems[i]) {
                        maItems.push(parseInt(option.maItems[i]));
                        option.maColors.push(defaultMaColors[i]);
                    }
                }
                option.maItems = maItems;
            }
            if (option.macd_s != undefined)
                option.macdConfig = [parseInt(option.macd_s), parseInt(option.macd_l), parseInt(option.macd_m)];
            //rsi相关
            if (option.rsiSelects) {
                var rsi_N = [];
                for (var i = 0; i < option.rsiSelects.length; i++) {
                    if (option.rsiSelects[i] && option.rsi_N[i]) {
                        rsi_N.push(parseInt(option.rsi_N[i]));
                    }
                }
                option.rsi_N = rsi_N;
            }
            //wr相关
            if (option.wrSelects) {
                var wr_N = [];
                for (var i = 0; i < option.wrSelects.length; i++) {
                    if (option.wrSelects[i] && option.wr_N[i]) {
                        wr_N.push(parseInt(option.wr_N[i]));
                    }
                }
                option.wr_N = wr_N;
            }
            return option;
        },
        enumerable: true,
        configurable: true
    });
    KlineSetting.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setCache(KLineOptionSettingKeyName, JSON.stringify(this.model.option));
                        return [4 /*yield*/, alertWindow(textRes.items['成功保存'])];
                    case 1:
                        _a.sent();
                        if (this.detailPage) {
                            this.detailPage.resetOptionForSetting();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    KlineSetting.prototype.maItemSelect = function (index) {
        this.vm.$set(this.model.option.maItemSelects, index, !this.model.option.maItemSelects[index]);
    };
    KlineSetting.prototype.rsiSelect = function (index) {
        this.vm.$set(this.model.option.rsiSelects, index, !this.model.option.rsiSelects[index]);
    };
    KlineSetting.prototype.wrSelect = function (index) {
        this.vm.$set(this.model.option.wrSelects, index, !this.model.option.wrSelects[index]);
    };
    KlineSetting.prototype.resetMa = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.maItems = defaultOption.maItems;
        this.model.option.maItemSelects = defaultOption.maItemSelects;
    };
    KlineSetting.prototype.resetRsi = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.rsiSelects = defaultOption.rsiSelects;
        this.model.option.rsi_N = defaultOption.rsi_N;
    };
    KlineSetting.prototype.resetWr = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.wrSelects = defaultOption.wrSelects;
        this.model.option.wr_N = defaultOption.wr_N;
    };
    KlineSetting.prototype.resetMacd = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.macd_s = defaultOption.macd_s;
        this.model.option.macd_l = defaultOption.macd_l;
        this.model.option.macd_m = defaultOption.macd_m;
    };
    KlineSetting.prototype.resetBoll = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.boll_n = defaultOption.boll_n;
        this.model.option.boll_k = defaultOption.boll_k;
    };
    KlineSetting.prototype.resetKdj = function () {
        var defaultOption = KlineSetting.defaultOption;
        this.model.option.kdj_cycle = defaultOption.kdj_cycle;
    };
    KlineSetting.prototype.clickTab = function (tab) {
        this.model.tabs.forEach(function (item) {
            item.selected = item === tab;
        });
    };
    return KlineSetting;
}(BaseComponent));
export { KlineSetting };
//# sourceMappingURL=KlineSetting.js.map