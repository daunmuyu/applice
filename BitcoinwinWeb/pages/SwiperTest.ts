import { Component } from "jack-one-script";
import { Swiper } from "jack-one-script";
var html = require("./swiperTest.html");

export class SwiperTest extends Component {
    swiper: Swiper;
    constructor() {
        super(html);

        this.swiper = new Swiper(this.element.querySelector(".main"), {
            imgPaths: ["imgs/banner/b1.jpg", "imgs/banner/b2.jpg", "imgs/banner/b3.jpg"],
            imgWidth: 1008,
            imgHeight: 309,
            borderRadius: 8,
            autoPlayInterval:3000,
        });
    }
}