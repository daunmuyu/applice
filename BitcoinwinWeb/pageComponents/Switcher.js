import { Component } from "jack-one-script";
import Vue from "vue";
var html = require("./switcher.html");
export function registerSwitcher() {
    Vue.component("switcher", {
        template: Component.requireHtml(html, { constructor: { name: "Switcher" } }),
        model: {
            prop: 'status',
            event: 'change'
        },
        data: function () {
            return {
                curStatus: this.status
            };
        },
        props: {
            /**要使用v-model绑定变量，不要直接用status，因为v-model才是双向绑定*/
            status: {
                type: Boolean,
                default: false
            },
            /**点击是否改变值*/
            clickchange: {
                type: Boolean,
                default: true
            },
            activecolor: {
                type: String,
                default: "#4aa138"
            },
        },
        methods: {
            meclick: function () {
                if (this.clickchange) {
                    this.curStatus = !this.curStatus;
                    this.$emit('change', this.curStatus);
                }
            }
        },
        watch: {
            status: function (newValue) {
                this.curStatus = newValue;
            }
        }
    });
}
//# sourceMappingURL=Switcher.js.map