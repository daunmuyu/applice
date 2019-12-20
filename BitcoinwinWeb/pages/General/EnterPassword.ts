import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { SetPayPassword } from "../My/SetPayPassword";
import { alertWindow } from "../../GlobalFunc";


var html = require("./enterPassword.html");
export class EnterPassword extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        password: "",
        err:false,
    };
    get needLogin() {
        return false;
    }
    get animationOnNavigation() {
        return false;
    }
    callback: (password: string) => void;

    constructor(callback: (password: string) => void) {
        super(html);

        this.model.textRes = textRes;
        this.callback = callback;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }   

    emptyClick() {

    }

    ok() {
       
        if (this.model.password) {
            this.model.err = false;
            navigation.pop(false);
            this.callback(this.model.password);
        }
        else {
            this.model.err = true;
        }
    }

    documentClick() {
        navigation.pop(false);
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        (<HTMLElement>this.element.querySelector("INPUT[_numberpanel]")).focus();
    }
}