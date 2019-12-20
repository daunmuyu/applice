import { Component } from "jack-one-script";
import Vue from "vue";
var html = require("./pageHeader.html");
export function registerPageHeader() {
    var safeAreaTop = 0;
    if (window.api) {
        safeAreaTop = window.api.safeArea.top;
    }
    Vue.component("pageheader", {
        template: Component.requireHtml(html, { constructor: { name: "pageHeader" } }),
        props: {
            title: String,
            textcolor: {
                type: String,
                default: ""
            },
            withbg: {
                type: Boolean,
                default: true
            },
            withloading: {
                type: Boolean,
                default: false
            },
            showloading: {
                default: false
            },
            showback: {
                type: Boolean,
                default: true
            },
            backcolor: {
                type: String,
                default: ""
            },
        },
        data: function () {
            return {
                safeAreaTop: safeAreaTop + "px"
            };
        },
        methods: {
            backClick: function () {
                window.navigation.pop();
            }
        }
    });
}
//# sourceMappingURL=PageHeader.js.map