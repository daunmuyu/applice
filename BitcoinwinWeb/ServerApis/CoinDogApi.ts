import { IHttpClientUsing } from "jack-one-script";
import { HttpClient } from "jack-one-script";

export class CoinDogApi {
    static async liveList(component: IHttpClientUsing, pageNumber, pageSize): Promise<any> {


        return new Promise(async (resolve, reject) => {
            try {
                if (!window.api) {
                    resolve([]);
                    return;
                }
                window.api.ajax({
                    url: `http://api.coindog.com/live/list?limit=${pageSize}&id=${((pageNumber - 1) * pageSize)}&flag=up`,
                    method: 'get',
                }, function (ret, err) {
                        if (ret) {
                            for (var i = 0; i < ret.list[0].lives.length; i++) {
                                try {
                                    var content = ret.list[0].lives[i].content;
                                    ret.list[0].lives[i].title = content.substr(1, content.indexOf("】") - 1);
                                    ret.list[0].lives[i].content = content.substr(content.indexOf("】") + 1);
                                }
                                catch (e) {

                                }
                            }

                        resolve(ret.list[0].lives);
                    } else {
                        reject(err);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    static async liveTodayList(component: IHttpClientUsing): Promise<any> {


        return new Promise(async (resolve, reject) => {
            try {
                if (!window.api) {
                    resolve([]);
                    return;
                }
                window.api.ajax({
                    url: `https://devapp.chainpayworld.com/live/list?id=0&flag=up`,
                    method: 'get',
                }, function (ret, err) {
                    if (ret) {
                        for (var i = 0; i < ret.list[0].lives.length; i++) {
                            try {
                                var content = ret.list[0].lives[i].content;
                                ret.list[0].lives[i].title = content.substr(1, content.indexOf("】") - 1);
                                ret.list[0].lives[i].content = content.substr(content.indexOf("】") + 1);
                            }
                            catch (e) {

                            }
                        }


                        resolve(ret.list[0].lives);
                    } else {
                        reject(err);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}