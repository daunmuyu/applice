import { IRunner } from "./IRunner";
import { GlobalDefines } from "./GlobalDefines";

export class Init implements IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param: any): void {
        console.log("init begin");
        try {

            window.api.setPrefs({
                key: "_webFolder",
                value: "web2"
            });


            window.api.addEventListener({
                name: 'keyback'
            }, (ret, err)=> {
                window.api.sendEvent({
                    name: 'onBackKeyPressed'
                });
            });

            window.api.setScreenOrientation({
                orientation: 'portrait_up'
            });


            window.api.setStatusBarStyle({
                style: 'light'
            });


            if (GlobalDefines.reOpenAppForMinutes > 0) {
                var pauseTime;
                window.api.addEventListener({
                    name: 'resume'
                }, (ret, err)=> {
                    if ((new Date().getTime() - pauseTime) / 60000 >= GlobalDefines.reOpenAppForMinutes) {
                        window.api.require('kLine').close();
                        window.setTimeout(()=> {
                            window.api.rebootApp();
                        }, 500);
                    }
                });

                window.api.addEventListener({
                    name: 'pause'
                }, (ret, err)=> {
                    pauseTime = new Date().getTime();
                });
            }

            console.log("init end");
            if (this.onSuccessed)
                this.onSuccessed.run(null);

        } catch (e) {
            console.log("init error");
            console.error(e.message);
            alert(e.message);
        }

       
    }


}