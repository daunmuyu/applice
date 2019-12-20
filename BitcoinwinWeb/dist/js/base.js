// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "H+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
String.prototype.toFixed = function () {
    return this;
};

//防止低版本浏览器不支持以下函数
if (!"".endsWith) {
    String.prototype.endsWith = function (str) {
        var index = this.indexOf(str);
        return index + str.length === this.length;
    };
}
if (!"".startsWith) {
    String.prototype.endsWith = function (str) {
        var index = this.indexOf(str);
        return index === 0;
    };
}

if (![].forEach) {
    Array.prototype.forEach = function (action) {
        for (var i = 0; i < this.length; i++) {
            action(this[i], i, this);
        }
    }
}

if (![].find) {
    Array.prototype.find = function (action) {
        for (var i = 0; i < this.length; i++) {
            if (action(this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    }
}
if (![].findIndex) {
    Array.prototype.findIndex = function (action) {
        for (var i = 0; i < this.length; i++) {
            if (action(this[i], i, this)) {
                return i;
            }
        }
        return -1;
    }
}


if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (action) {
        for (var i = 0; i < this.length; i++) {
            action(this[i], i, this);
        }
    }
}

if (!NodeList.prototype.find) {
    NodeList.prototype.find = function (action) {
        for (var i = 0; i < this.length; i++) {
            if (action(this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    }
}
if (!NodeList.prototype.findIndex) {
    NodeList.prototype.findIndex = function (action) {
        for (var i = 0; i < this.length; i++) {
            if (action(this[i], i, this)) {
                return i;
            }
        }
        return -1;
    }
}


function hidePhone(phone) {
    try {
        if (phone.length === 3) {
            return phone.substr(0, 1) + "*" + phone.substr(2, 1);
        }
        else if (phone.length === 2) {
            return "*" + phone.substr(1, 1);
        }
        else if (phone.length > 3 && phone.length < 5) {
            return phone.substr(0, 1) + "*" + phone.substr(phone.length - 1, 1);
        }
        return "****" + phone.substr(phone.length - 4, 4);
    }
    catch(e)
    {
        return "****" + phone;
    }
}
function formatMoney(pa, fh) {

    if (pa == null || pa == undefined || pa === "")
        return "--";

    var val = pa;
    if (typeof pa !== "string")
        val = pa + "";

    if (val.indexOf(",") >= 0) {
        if (fh && val.indexOf(fh) !== 0 && parseFloat(pa) > 0)
            val = fh + val;
        return val;
    }


    var arr = val.split('.');
    var numberLen = arr[0].length;

    var result = "";
    for (var i = numberLen; i > 0;) {
        var getlen = Math.min(3, i);
        if (result.length > 0)
            result = "," + result;
        result = arr[0].substr(i - getlen, getlen) + result;
        i -= getlen;
    }
    if (arr.length > 1)
        result += "." + arr[1];
    if (fh && parseFloat(result) > 0)
        result = fh + result;
    if (result.indexOf("-,") === 0)
        result = "-" + result.substr(2);
    return result;
}
String.prototype.formatMoney = function (fh) {
    return formatMoney(this, fh);
};
Number.prototype.formatMoney = function (fh) {
    return formatMoney(this, fh);
};

(function () {
    if (!window.designWidth) {
        window.designWidth = 1125;//UI设计图的px宽度
    }
    var scale = 1.0;//后期调整这个值调整整体大小
    var windowWidth = window.screen.width;//只能用window.screen.width，不要用window.innerWidth或者outerWidth，因为这段代码是在一开始执行的，这时候页面还没有加载完毕，所以innerWidth可能是0

    //window.innerWidth在旧版android的值不正确，会变大
    window.__remConfig_flag = (windowWidth / window.designWidth) * 100 * scale;
    document.documentElement.style.fontSize = window.__remConfig_flag + "px";
})();

function getFontSize(rem,isMore) {
    var value = parseInt(rem * window.__remConfig_flag);
    if (isMore)
        value += 2 - value % 2;
    else
        value -= value % 2;
    value = parseInt(value);
    return value + "px";
}