import { Component } from "jack-one-script";
import Vue from "vue";
var html = require("./numberPanel.html");
export function registerNumberPanel() {
    Vue.component("numberpanel", {
        template: Component.requireHtml(html, { constructor: { name: "numberpanel" } }),
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: String,
                default: ""
            },
            itemwidth: {
                type: String,
                default: "20px"
            },
            bordercolor: {
                type: String,
                default: "#979797"
            },
            itemcount: {
                type: Number,
                default: 6
            },
            shownumber: {
                type: Boolean,
                default: false
            },
            ispassword: {
                type: Boolean,
                default: true
            },
            keyboardtype: {
                type: String,
                default: "text"
            },
            borderradius: {
                type: String,
                default: "3px"
            },
        },
        data: function () {
            return {
                textvalue: this.value,
            };
        },
        methods: {
            keydown: function (e) {
                if (e.keyCode === 13) {
                    this.$el.querySelector("INPUT").blur();
                }
                else if (e.keyCode === 8 && this.value.length > 0) {
                    this.value = this.value.substr(0, this.value.length - 1);
                    this.$emit('change', this.value);
                }
            }
        },
        watch: {
            textvalue: function (newvalue, oldvalue) {
                newvalue = newvalue.trim();
                if (newvalue.length > 0) {
                    var str = this.value + newvalue;
                    if (str.length > this.itemcount)
                        str = str.substr(0, this.itemcount);
                    if (str !== this.value) {
                        this.value = str;
                        this.$emit('change', this.value);
                    }
                }
                this.textvalue = "";
            },
        }
    });
}
//# sourceMappingURL=NumberPanel.js.map