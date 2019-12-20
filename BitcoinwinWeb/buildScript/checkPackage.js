var fs = require("fs");
const { exec } = require('child_process');

//比较两个版本号大小，如果 version1 > version2 返回 1，如果 version1 < version2 返回 2，相等返回0
function compare(version1, version2) {
    var arr1 = version1.split('.');
    var arr2 = version2.split('.');
    for (var i = 0; i < arr1.length && i < arr2.length; i++) {
        var int1 = parseInt(arr1[i]);
        var int2 = parseInt(arr2[i]);

        if (int1 < int2)
            return 2;
        else if (int1 > int2)
            return 1;
    }
    if (arr1.length > arr2.length)
        return 1;

    if (arr1.length < arr2.length)
        return 2;

    return 0;
}

function readJsonFile(path) {
    return fs.readFileSync(path).toString('utf8');
}

function check() {
    //let files = fs.readdirSync("./package.json");//读取目录中的所有文件及文件夹（同步操作）

    var content = readJsonFile('./package.json');
    var dependencies = JSON.parse(content).dependencies;
    for (var moduleName in dependencies) {
        var configVersion = dependencies[moduleName].replace("^", "");
        var path = "./node_modules/" + moduleName + "/package.json";
        var version = JSON.parse(readJsonFile(path)).version;
        //console.log(moduleName + " current version:" + version);
        //console.log("package config:" + configVersion);

        if (compare(configVersion, version) === 1) {
            console.log(moduleName + "需要获取相应版本号");
            exec("npm install " + moduleName + "@" + configVersion + " --save", function (err, outstr, errstr) {
                if (outstr)
                    console.log(outstr);
                if (errstr)
                    console.log(errstr);
            });
        }
    }
}

check();