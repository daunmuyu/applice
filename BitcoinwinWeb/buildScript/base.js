var fs = require("fs");

let path = require("path");//工具模块，处理文件路径的小工具
let JSZIP = require("jszip");
let zip = new JSZIP();


//读取目录及文件
function readDir(obj, nowPath) {
    let files = fs.readdirSync(nowPath);//读取目录中的所有文件及文件夹（同步操作）
    files.forEach(function (fileName, index) {//遍历检测目录中的文件
        if (fileName.endsWith("version.txt") ||
            fileName.endsWith("dist.zip") ||
            fileName == "bundle.js" ||
            fileName == "bundle-b.js")
            return;

        console.log(fileName, index);//打印当前读取的文件名
        let fillPath = nowPath + "/" + fileName;
        let file = fs.statSync(fillPath);//获取一个文件的属性
        if (file.isDirectory()) {//如果是目录的话，继续查询
            let dirlist = obj.folder(fileName);//压缩对象中生成该目录
            readDir(dirlist, fillPath);//重新检索目录文件
        } else {
            if (fileName == "bundle-p.js")
                fileName = "bundle.js";
            obj.file(fileName, fs.readFileSync(fillPath));//压缩目录添加文件
        }
    });
}

//开始压缩文件
function startZIP() {
    var currPath = __dirname;//文件的绝对路径 当前当前js所在的绝对路径
    var targetDir = path.join(currPath, "../dist");
    readDir(zip, targetDir);
    zip.generateAsync({//设置压缩格式，开始打包
        type: "nodebuffer",//nodejs用
        compression: "DEFLATE",//压缩算法
        compressionOptions: {//压缩级别
            level: 9
        }
    }).then(function (content) {
        fs.writeFileSync(currPath + "/../dist/dist.zip", content, "utf-8");//将打包的内容写入 当前目录下的 result.zip中
    });
}

exports.run = function (customVersion) {

    fs.exists('./dist/dist.zip', function (exists) {

        if (exists) {
            fs.unlink('./dist/dist.zip', function (err) {
                if (err)
                    console.error(err.message);
                else
                    console.log("delete dist.zip successfully!");
            });
        }
    });


    startZIP();

    fs.readFile('./dist/version.txt', function (err, data) {
        if (err) throw err;
        // data默认是一个Buffer对象，里面保存的就是一个一个的字节，(理解为字节数组)
        // 把Buffer对象转换为字符串，调用toString()方法
        var versionObj = {};
        eval("versionObj=" + data.toString('utf8'));
        versionObj.currentVersion++;
        if (customVersion != undefined)
            versionObj.currentVersion = customVersion;

        fs.writeFile('./dist/version.txt', JSON.stringify(versionObj), {
            encoding: 'utf8'
        }, function (err) {
            if (err) {
                console.log('version.txt文件写入错误，错误是：' + err);
            } else {
                console.log('版本更新到' + versionObj.currentVersion);
            }
        });

    });

};