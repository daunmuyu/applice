import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { SetPayPassword } from "../My/SetPayPassword";


var html = require("./enterPayPassword.html");
export class EnterPayPassword extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        password: "",
        title:"",
        isBusy: false,
        canSetPwd:false,
    };
    get needLogin() {
        return true;
    }

    constructor(title: string, canSetPwd: boolean, callback: (password: string) => void) {
        super(html);

        this.model.canSetPwd = canSetPwd;
        this.model.textRes = textRes;
        this.model.title = title;
        if (!this.model.title)
            this.model.title = textRes.items["请输入支付密码"];

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                password: function (newvalue, oldvalue) {
                    callback(newvalue);
                }
            }
        });
    }   

    emptyClick() {

    }

    documentClick() {
        navigation.pop(false);
    }
    setPwdClick() {
        navigation.push(new SetPayPassword());
    }
    onNavigationPushed() {
        super.onNavigationPushed();

        (<HTMLElement>this.element.querySelector("INPUT[_numberpanel]")).focus();
    }
}