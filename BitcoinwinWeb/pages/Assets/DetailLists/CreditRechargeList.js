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
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { CreditFlowList } from "./CreditFlowList";
import { RechargeDetail } from "./RechargeDetail";
import { WithdrawDetail } from "./WithdrawDetail";
var CreditRechargeList = /** @class */ (function (_super) {
    __extends(CreditRechargeList, _super);
    function CreditRechargeList() {
        var _this = _super.call(this) || this;
        _this.model.title = textRes.items["信用资本明细"];
        return _this;
    }
    Object.defineProperty(CreditRechargeList.prototype, "types", {
        get: function () {
            return [
                {
                    name: textRes.items['充值信用资本'],
                    id: 3,
                    f: "+",
                    color: textRes.items['TextColor涨'],
                    detailClass: RechargeDetail,
                },
                {
                    name: textRes.items['提取信用资本'],
                    id: 4,
                    f: "-",
                    color: textRes.items['TextColor跌'],
                    detailClass: WithdrawDetail,
                },
                {
                    name: textRes.items['抵消信用资本'],
                    id: 9,
                    f: "-",
                    color: textRes.items['TextColor跌'],
                    detailClass: WithdrawDetail,
                },
            ];
        },
        enumerable: true,
        configurable: true
    });
    CreditRechargeList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        var optype = this.model.opType;
        if (optype.indexOf && optype.indexOf("[") >= 0)
            eval("optype=" + optype);
        if (optype == 3) {
            AccountApi.GetPayinList(this, 2, this.model.pageNumber, 18, function (ret, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].opType = optype;
                        ret[i].typeObj = _this.getType(ret[i].opType);
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (optype == 4) {
            AccountApi.GetPayOutList(this, 2, this.model.pageNumber, 18, function (ret, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].opType = optype;
                        ret[i].typeObj = _this.getType(ret[i].opType);
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetUserCoinFlowList(this, optype, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, function (ret, err) {
                _this.model.isBusy = false;
                if (err) {
                    _this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    _this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = _this.getType(ret[i].opType);
                        _this.model.datas.push(ret[i]);
                    }
                    _this.model.hasMore = ret.length == 18;
                }
            });
        }
    };
    return CreditRechargeList;
}(CreditFlowList));
export { CreditRechargeList };
//# sourceMappingURL=CreditRechargeList.js.map