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
import { Component } from "jack-one-script";
import { Swiper } from "jack-one-script";
var html = require("./swiperTest.html");
var SwiperTest = /** @class */ (function (_super) {
    __extends(SwiperTest, _super);
    function SwiperTest() {
        var _this = _super.call(this, html) || this;
        _this.swiper = new Swiper(_this.element.querySelector(".main"), {
            imgPaths: ["imgs/banner/b1.jpg", "imgs/banner/b2.jpg", "imgs/banner/b3.jpg"],
            imgWidth: 1008,
            imgHeight: 309,
            borderRadius: 8,
            autoPlayInterval: 3000,
        });
        return _this;
    }
    return SwiperTest;
}(Component));
export { SwiperTest };
//# sourceMappingURL=SwiperTest.js.map