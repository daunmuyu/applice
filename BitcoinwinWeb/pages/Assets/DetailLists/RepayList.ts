import { CreditFlowList } from "./CreditFlowList";

export class RepayList extends CreditFlowList {
    get types() {
        return [
            {
                name: textRes.items['还款'],
                id: [2, 5, 6, 7],
                f: "-",
                color: textRes.items['TextColor跌'],
            },
        ];
    }
    constructor() {
        super();
    }
}