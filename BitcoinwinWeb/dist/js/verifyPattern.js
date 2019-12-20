//vue 绑定长按功能:v-on:longtouch="alert(2)"

(function () {
    if (window._configPatternHandlered)
        return;
    //防止js被两次引用
    window._configPatternHandlered = true;

    function onkeyup(e) {
        var inputEle = e.target;
       
        var val = inputEle.value;
        var arr = inputEle._jpattern.exec(val);
        if (Array.isArray(arr))
            arr = arr[0];
        if (val != arr) {

            if (inputEle._vm && inputEle.getAttribute("_vmodel")) {
                eval("inputEle._vm." + inputEle.getAttribute("_vmodel") + "=arr");
            }
            else {
                inputEle.value = arr;
            }
            
        }
    }

    function PatternHandler(element) {
        if (element._patternInited)
            return;
        element._patternInited = true;

        var pattern = element.getAttribute("jpattern");
        if (pattern) {
            pattern = eval("/" + pattern + "/");
            element._jpattern = pattern;
            element.addEventListener("keyup", onkeyup);
        }
    }



    function initFunc() {
        var func = function (container) {
            if (container != document && !container.getAttribute)
                return;
            if (container != document && container.nodeType == 3)//3表示#text类型，不是htmlElement
                return;

            if (container.tagName == "INPUT") {
                PatternHandler(container);
                return;
            }

            var eles = container.querySelectorAll("*[jpattern]");
            for (var i = 0; i < eles.length; i++) {
                PatternHandler(eles[i]);
            }
        }

        if (!window._patternHandlerInited) {
            window._patternHandlerInited = true;
            //监视document.body子元素变动事件，新加入的element，如果定义touchmode，则自动PatternHandler(element)
            var MutationObserver = window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

            var mutationObserverSupport = !!MutationObserver;
            if (mutationObserverSupport) {
                try {
                    var options = {
                        'childList': true,
                        subtree: true,
                    };
                    var callback = function (records) {//MutationRecord
                        records.map(function (record) {
                            for (var i = 0 ; i < record.addedNodes.length ; i++) {
                                if (!record.addedNodes[i]._patternInited) {
                                    func(record.addedNodes[i]);
                                }
                            }
                        });
                    };

                    var observer = new MutationObserver(callback);
                    observer.observe(document.body, options);

                }
                catch (e) {
                    //alert(e.message);
                }
            }
            else {
                //throw "浏览器不支持MutationObserver";

                function nodeAddedCallback(e) {
                    func(e.target);
                }
                document.body.addEventListener("DOMNodeInserted", nodeAddedCallback, false);
            }
        }

        func(document);

    }


    if (document.addEventListener ) {
        document.addEventListener('DOMContentLoaded', initFunc, false);
    }
})();
