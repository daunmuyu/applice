import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showError } from "../../Global";
import { TradeApi } from "../../ServerApis/TradeApi";
import { WatchPriceAssistantEditor } from "./WatchPriceAssistantEditor";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { alertWindow } from "../../GlobalFunc";
import { ConfirmWindow } from "../General/ConfirmWindow";



var html = require("./watchPriceAssistant.html");
export class WatchPriceAssistant extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: 0,
       list:[],
    };
    static CurrentList: any[] = [];

    InsertWatchPriceAction: (p) => void;

    constructor() {
        super(html);

        this.model.textRes = textRes;
       

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        this.InsertWatchPriceAction = (p) => {
            p.expanded = true;
            this.model.list.forEach(m => m.expanded = false);
            this.model.list.push(p);
        };

        MessageCenter.register(MessageType.InsertWatchPrice, this.InsertWatchPriceAction);
    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.loadList();
    }

    onNavigationPoped() {
        super.onNavigationPoped();
        MessageCenter.unRegister(MessageType.InsertWatchPrice, this.InsertWatchPriceAction);
    }

    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);
        MessageCenter.raise(MessageType.StartRefreshQuotation, null);
    }
    onNavigationUnActived(ispop) {
        super.onNavigationUnActived(ispop);
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    }

    /**
     * 判断item是否包含指定的subitemtype
     * @param item
     * @param subtypes
     */
    hasSubitmeType(item, subtypes: number[]) {
        var subItems: any[] = item.subItems;
        return subItems.some(m => m.enable && subtypes.some(t=> t == m.type));
    }

    getSubitemValue(item, type) {
        var subItems: any[] = item.subItems;
        var subitem = subItems.find(m => m.enable && m.type == type);
        if (subitem)
            return subitem.value;
        return undefined;
    }

    modify(item) {
        navigation.push(new WatchPriceAssistantEditor(item));
    }
    async deleteItem(item) {
        if (window.confirm(textRes.items['确定删除吗？'])) {
            try {
                this.model.isBusy++;
                await TradeApi.RemoveMarketWatch(this, item.id);
                this.model.list.splice(this.model.list.indexOf(item), 1);
            } catch (e) {
                showError(e);
            }
            finally {
                this.model.isBusy--;
            }
        }
    }
    addClick() {
        navigation.push(new WatchPriceAssistantEditor());
    }
    async loadList() {
        try {
            this.model.isBusy++;

            WatchPriceAssistant.CurrentList = await TradeApi.GetMarketWatchList(this);
            if (WatchPriceAssistant.CurrentList.length == 0) {
                navigation.push(new WatchPriceAssistantEditor(undefined), false);
                navigation.unloadComponent(this);
            }
            else {
                WatchPriceAssistant.CurrentList.forEach(m => {
                    m.expanded = false;
                    var subItems: any[] = m.subItems;
                    subItems.forEach(m => {
                        if (m.type > 2) {
                            m.value = parseFloat(m.value) * 100 + "";
                        }
                    });
                    var commodity = ApiHelper.getDescriptionByMarketSymbol(m.symbol);
                    m.commodity = commodity;
                    if (!commodity)
                        m.commodity = {};
                })
                this.model.list = WatchPriceAssistant.CurrentList;
            }
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy--;
        }
    }
}