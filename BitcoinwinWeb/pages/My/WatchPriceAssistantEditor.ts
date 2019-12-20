import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showError, clone } from "../../Global";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { TradeApi } from "../../ServerApis/TradeApi";
import { alertWindow } from "../../GlobalFunc";
import { WatchPriceAssistant } from "./WatchPriceAssistant";
import { parse } from "url";



var html = require("./watchPriceAssistantEditor.html");
export class WatchPriceAssistantEditor extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: 0,
        AllCommodities:[],
        item: {
            "id": 0,
            commodity: <Description>{},
            "symbol": "",
            "subItems": [
                {
                    "type": 1,
                    "enable": false,
                    "value": "",
                },
                {
                    "type":2,
                    "enable": false,
                    "value": "",
                }
                ,
                {
                    "type": 3,
                    "enable": false,
                    "value": "",
                },
                {
                    "type": 4,
                    "enable": false,
                    "value": "",
                },
                {
                    "type": 5,
                    "enable": false,
                    "value": "",
                },
                {
                    "type": 6,
                    "enable": false,
                    "value": "",
                },
                {
                    "type": 7,
                    "enable": false,
                    "value": "",
                },
                {
                    "type": 8,
                    "enable": false,
                    "value": "",
                }
            ],
            "notifyFrequency": 0,
            "notifyType": 0
        },
    };
    originalData: any;
    constructor(item = undefined) {
        super(html);

        this.originalData = item;

        this.model.AllCommodities.push({});
        ApiHelper.Descriptions.forEach(m => {            
            if (this.model.AllCommodities.some(item => item.marketsymbol === m.marketsymbol) === false) {
                this.model.AllCommodities.push(m);
            }
        });

        this.updateOriginalDataToUI();

        this.model.textRes = textRes;
       

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                "item.symbol": (newValue) => {
                    if (!newValue)
                        return;

                    this.model.item.commodity = this.model.AllCommodities.find(m => m.marketsymbol === newValue);
                    //如果选择不同的币种，则先看看这个币种是不是已经存在，如果存在，则进入编辑模式
                    var settingItem = WatchPriceAssistant.CurrentList.find(m => m.symbol === this.model.item.commodity.marketsymbol);
                    if (settingItem) {
                        this.originalData = settingItem;
                        this.updateOriginalDataToUI();
                    }
                }
            },
        });

        this.supportVerifyJPattern(this.vm);
    }

   

    /**更新originalData到界面上 */
    updateOriginalDataToUI() {
        if (this.originalData) {

            for (var p in this.model.item) {
                if (p != "subItems") {
                    this.model.item[p] = this.originalData[p];
                }
            }

            this.model.item.subItems.forEach((subitem, index) => {
                var srcitem = this.originalData.subItems.find(m => m.type == subitem.type);
                if (srcitem) {
                    subitem.enable = srcitem.enable;
                    subitem.value = srcitem.value;
                }
                else {
                    subitem.enable = false;
                    subitem.value = "";
                }
            });
        }
    }

    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);
        MessageCenter.raise(MessageType.StartRefreshQuotation, null);
    }
    onNavigationUnActived(ispop) {
        super.onNavigationUnActived(ispop);
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    }

    async submit() {
        if (!this.model.item.commodity.symbol) {
            await alertWindow(textRes.items['请先选择币种']);
            return;
        }
        this.model.isBusy++;
        try {

            var subitems : any[] = clone(this.model.item.subItems);
            for (var i = 0; i < subitems.length; i++) {
                if (!subitems[i].enable || isNaN(parseFloat(subitems[i].value))) {
                    subitems.splice(i, 1);
                    i--;
                }
                else if (subitems[i].type > 2 && subitems[i].value) {
                    subitems[i].value = parseInt(subitems[i].value) / 100;
                }
            }

            if (subitems.length == 0) {
                throw textRes.items['请至少设置一项有效的盯盘参数'];
            }
           
           var ret = await TradeApi.UpsertMarketWatch(this,
                this.model.item.id === 0 ? undefined : this.model.item.id,
                this.model.item.symbol,
                subitems,
                this.model.item.notifyFrequency,
                this.model.item.notifyType);

            if (this.originalData) {
                for (var p in this.model.item) {
                    this.originalData[p] = this.model.item[p];
                }
            }
            else {
                this.model.item.id = ret.id;
                if (navigation.queue.some(m => m.constructor === WatchPriceAssistant))
                    MessageCenter.raise(MessageType.InsertWatchPrice, this.model.item);
                else
                {
                    navigation.push(new WatchPriceAssistant(), false);
                    navigation.unloadComponent(this);
                    return;
                }
            }

            navigation.pop();
        } catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy--;
        }
    }
}