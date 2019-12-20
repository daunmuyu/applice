import { Component } from "jack-one-script";
import Vue from "vue";
var html = require("./waiting.html");
export function registerWaiting() {
    Vue.component("waiting", {
        template: Component.requireHtml(html, { constructor: { name: "Waiting" } }),
        props: {
            /**如：审核中 */
            title: String,
            /**几秒后返回到什么 */
            backtitle: String,
            seconds: Number,
            color: {
                type: String,
                default: "#F8B55D"
            },
        },
        data: function () {
            return {};
        },
        methods: {
            backClick: function () {
                this.$emit('back');
            },
            /**倒计时 */
            countSeconds: function () {
                this.seconds = Math.max(0, this._startSeconds - parseInt(((new Date().getTime() - this._startTime) / 1000)));
                if (this.seconds == 0) {
                    this.$emit('back');
                }
                else {
                    setTimeout(this.countSeconds, 1000);
                }
            }
        },
        mounted: function () {
            if (this.seconds > 0) {
                this._startSeconds = this.seconds;
                this._startTime = new Date().getTime();
                setTimeout(this.countSeconds, 1000);
            }
        }
    });
}
//# sourceMappingURL=Waiting.js.map