import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { showError } from "../../Global";
import { BuyInfo, TradeApi } from "../../ServerApis/TradeApi";
import { KLineDataRefresh } from "../../libs/KLineDataRefresh";
import { Order } from "./Order";
var html = require("./order_L.html");

export class Order_L extends Order {

    constructor(param) {
        super(param, html);
    }
}