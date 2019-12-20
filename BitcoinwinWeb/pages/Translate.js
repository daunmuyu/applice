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
import Vue from "vue";
import { BaseComponent } from "../BaseComponent";
import { lang_zh_CN } from "../lang_zh_CN";
import { lang_en_US } from "../lang_en_US";
var html = require("./translate.html");
var Translate = /** @class */ (function (_super) {
    __extends(Translate, _super);
    function Translate() {
        var _this = _super.call(this, html) || this;
        _this.result = {};
        _this.model = {
            isBusy: false,
            datas: []
        };
        document.documentElement.style.fontSize = "12px";
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        for (var key in lang_zh_CN.items) {
            var e = lang_en_US.items[key];
            _this.model.datas.push({
                c: lang_zh_CN.items[key],
                e: e,
                key: key
            });
            //if (!e || /.*[\u4e00-\u9fa5]+.*$/.test(e)) {
            //    this.model.datas.push({
            //        c: lang_zh_CN.items[key],
            //        e,
            //        key
            //    });
            //}
            //else {
            //    this.result[key] = e;
            //}
        }
        return _this;
    }
    Translate.prototype.save = function () {
        var _this = this;
        this.model.datas.forEach(function (m) {
            if (m.e)
                _this.result[m.key] = m.e;
        });
        this.model.isBusy = true;
        console.log(JSON.stringify(this.result));
        //ApiHelper.Log(null, JSON.stringify(this.result), (ret, err) => {
        //    this.model.isBusy = false;
        //    if (err)
        //        alert(JSON.stringify(err));
        //    else {
        //        alert("保存成功");
        //    }
        //});
    };
    return Translate;
}(BaseComponent));
export { Translate };
//# sourceMappingURL=Translate.js.map