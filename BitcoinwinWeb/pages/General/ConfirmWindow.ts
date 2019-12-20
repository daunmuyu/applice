import { BaseComponent } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { SetPayPassword } from "../My/SetPayPassword";


var html = require("./confirmWindow.html");
export class ConfirmWindow extends BaseComponent {
    vm: Vue;
    callback: () => void;
    model = {
        textRes: <TextRes>{},
        captions: [],
        contents:[],
    };
    get animationOnNavigation() {
        return false;
    }

    get needLogin() {
        return true;
    }

    constructor( captions:string[],contents:any[], callback: () => void) {
        super(html);

        this.model.captions = captions;
        this.model.contents = contents;
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
    submit() {
        navigation.pop(false);
        if (this.callback)
            this.callback();
    }
    documentClick() {
        navigation.pop(false);
    }
    
}