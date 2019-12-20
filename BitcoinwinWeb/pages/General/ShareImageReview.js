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
import { shareImage } from "../../GlobalFunc";
var html = require("./shareImageReview.html");
var ShareImageReview = /** @class */ (function (_super) {
    __extends(ShareImageReview, _super);
    function ShareImageReview(imgdata) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            img: "",
        };
        _this.model.img = imgdata;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue()
        });
        return _this;
    }
    ShareImageReview.prototype.okClick = function () {
        navigation.pop(false);
        shareImage(this.model.img);
    };
    ShareImageReview.prototype.cancelClick = function () {
        navigation.pop(false);
    };
    return ShareImageReview;
}(BaseComponent));
export { ShareImageReview };
//# sourceMappingURL=ShareImageReview.js.map