import { BaseComponent } from "../../BaseComponent";
import Vue from "vue"
var html = require("./alertWindow.html");
export interface AlertWindowButton {
    text: string;
    bgColor?: string;
    fontColor?: string;
    action?: any;
}

export class AlertWindow extends BaseComponent
{
    get needLogin() {
        return false;
    }

    vm: Vue;
    bodyClickCallback: () => void;
    model = {
        textRes: textRes,
        title: undefined,
        content: undefined,
        isBusy:0,
        textAlign: "left",
        buttons: <AlertWindowButton[]>[],
    };
    constructor()
    {
        super(html);

        this.vm = new Vue({
            el: this.getViewModelElement(),
            methods: this.getMethodObjectForVue(),
            data: this.model
        });
    }

    itemClick(btn: AlertWindowButton) {
        this.dispose();
        if (btn.action) {
            try {
                btn.action();
            }
            catch (e) {

            }
        }
    }

    bodyClick() {
        if (this.bodyClickCallback)
            this.bodyClickCallback();
    }
}