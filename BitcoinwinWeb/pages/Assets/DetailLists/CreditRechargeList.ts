import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, CreditFlowItem } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { CreditFlowList } from "./CreditFlowList";
import { RechargeDetail } from "./RechargeDetail";
import { WithdrawDetail } from "./WithdrawDetail";

export class CreditRechargeList extends CreditFlowList {

    get types() {
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
    }
    constructor() {
        super();
        this.model.title = textRes.items["信用资本明细"];
    }

    loadData() {
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
            AccountApi.GetPayinList(this, 2,  this.model.pageNumber, 18, (ret, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].opType = optype;
                        ret[i].typeObj = this.getType(ret[i].opType);
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (optype == 4) {
            AccountApi.GetPayOutList(this, 2, this.model.pageNumber, 18, (ret, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].opType = optype;
                        ret[i].typeObj = this.getType(ret[i].opType);
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetUserCoinFlowList(this, optype, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.debug(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = this.getType(ret[i].opType);
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
    }
}