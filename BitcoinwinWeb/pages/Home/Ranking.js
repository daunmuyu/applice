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
import { IndexApi } from "../../ServerApis/IndexApi";
var html = require("./ranking.html");
var Ranking = /** @class */ (function (_super) {
    __extends(Ranking, _super);
    function Ranking() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            isBusy: false,
            textRes: {},
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        _this.model.textRes = textRes;
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
    Object.defineProperty(Ranking.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Ranking.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    Ranking.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        IndexApi.rankings(this, this.model.pageNumber, 18, function (ret, err) {
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
                _this.model.hasMore = ret.length == 18;
            }
        });
    };
    Ranking.prototype.loadMore = function () {
        this.loadData();
    };
    return Ranking;
}(BaseComponent));
export { Ranking };
//# sourceMappingURL=Ranking.js.map