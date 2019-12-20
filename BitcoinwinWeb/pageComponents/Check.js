import { Component } from "jack-one-script";
import Vue from "vue";
var html = require("./check.html");
export function registerCheck() {
    Vue.component("check", {
        template: Component.requireHtml(html, { constructor: { name: "Checker" } }),
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: "#ee3439"
            },
            text: {
                type: String,
                default: ""
            },
            textcolor: {
                type: String,
                default: "#e43436"
            },
            fontsize: {
                type: String,
                default: "0.3rem"
            },
        },
        methods: {
            meclick: function () {
                this.checked = !this.checked;
                this.$emit('change', this.checked);
            }
        },
    });
}
//# sourceMappingURL=Check.js.map