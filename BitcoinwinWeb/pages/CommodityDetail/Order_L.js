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
import { Order } from "./Order";
var html = require("./order_L.html");
var Order_L = /** @class */ (function (_super) {
    __extends(Order_L, _super);
    function Order_L(param) {
        return _super.call(this, param, html) || this;
    }
    return Order_L;
}(Order));
export { Order_L };
//# sourceMappingURL=Order_L.js.map