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
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { setTimeout } from "timers";
import { HttpClient } from "jack-one-script";
import { showError } from "../../Global";
var html = require("./rule.html");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule(commodity) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            commodity: null,
            isBusy: false,
            textRes: null,
            items: [],
            tips: "",
        };
        _this.model.textRes = textRes;
        _this.model.commodity = {};
        for (var p in commodity) {
            _this.model.commodity[p] = commodity[p];
        }
        if (_this.model.commodity.symbolnameen === "DAPPPRO")
            _this.model.commodity.marketsymbol = "DAPPPROUSDT";
        _this.model.commodity.symbol = _this.model.commodity.marketsymbol;
        _this.model.commodity.name = _this.model.commodity.symbolnameen;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            methods: _this.getMethodObjectForVue(),
            data: _this.model,
        });
        return _this;
    }
    Object.defineProperty(Rule.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Rule.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    Rule.prototype.getContent = function (content) {
        while (true) {
            var regx = /\{([\s\S]+)\}/.exec(content);
            if (regx) {
                var expression = regx[1].replace(/\<br\>/g, "\n");
                console.log(expression);
                var item = this.model.commodity;
                var result = eval(expression);
                content = content.replace(regx[0], result);
            }
            else {
                break;
            }
        }
        return content;
    };
    Rule.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var originalIsDemo, ret, startindex, endindex, div, table, i, row, title, content, action, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ApiHelper.UrlAddressReady) {
                            setTimeout(function () { return _this.loadData(); }, 500);
                            return [2 /*return*/];
                        }
                        this.model.isBusy = true;
                        originalIsDemo = HttpClient.defaultHeaders.IsDemo;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        console.log(ApiHelper.ResourceAddress + "/rule/" + textRes.langName.replace("-", "_") + ".htm");
                        //删除IsDemo头，否则读取这个网络文件会报错
                        delete HttpClient.defaultHeaders.IsDemo;
                        return [4 /*yield*/, HttpClient.sendAsync({
                                method: "GET",
                                url: ApiHelper.ResourceAddress + "/rule/" + textRes.langName.replace("-", "_") + ".htm?t=" + new Date().getTime(),
                            })];
                    case 2:
                        ret = _a.sent();
                        startindex = ret.indexOf("<table");
                        endindex = ret.indexOf("</table");
                        ret = ret.substr(startindex, endindex - startindex) + "</table>";
                        div = document.createElement("DIV");
                        div.innerHTML = ret;
                        table = div.children[0];
                        for (i = 0; i < table.rows.length; i++) {
                            row = table.rows[i];
                            title = row.cells[1].innerHTML;
                            if (!title)
                                break;
                            content = "";
                            try {
                                content = row.cells[2].innerHTML;
                            }
                            catch (e) { }
                            if (content) {
                                content = this.getContent(content);
                                this.model.items.push({
                                    title: title,
                                    content: content
                                });
                                console.log(JSON.stringify(this.model.items[this.model.items.length - 1]));
                            }
                            else {
                                this.model.tips = this.getContent(title);
                                console.log(this.model.tips);
                            }
                        }
                        action = function () {
                            if (!_this.element.querySelector("#tdsample"))
                                setTimeout(action, 100);
                            else
                                _this.element.querySelector("#tdheader").style.width = _this.element.querySelector("#tdsample").offsetWidth + 'px';
                        };
                        setTimeout(action, 100);
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        alert(JSON.stringify(e_1));
                        showError(e_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        HttpClient.defaultHeaders.IsDemo = originalIsDemo;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Rule;
}(BaseComponent));
export { Rule };
//# sourceMappingURL=Rule.js.map