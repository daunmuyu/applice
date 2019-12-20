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
import { CreditFlowList } from "./CreditFlowList";
var RepayList = /** @class */ (function (_super) {
    __extends(RepayList, _super);
    function RepayList() {
        return _super.call(this) || this;
    }
    Object.defineProperty(RepayList.prototype, "types", {
        get: function () {
            return [
                {
                    name: textRes.items['还款'],
                    id: [2, 5, 6, 7],
                    f: "-",
                    color: textRes.items['TextColor跌'],
                },
            ];
        },
        enumerable: true,
        configurable: true
    });
    return RepayList;
}(CreditFlowList));
export { RepayList };
//# sourceMappingURL=RepayList.js.map