import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { shareImage } from "../../GlobalFunc";

var html = require("./shareImageReview.html");
export class ShareImageReview extends BaseComponent {
    vm: Vue;
    model = {
        img:"",
    };
    constructor(imgdata) {
        super(html);

        this.model.img = imgdata;
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue()
        });
    }

    okClick() {
        navigation.pop(false);
        shareImage(this.model.img);
    }

    cancelClick() {
        navigation.pop(false);
    }
}