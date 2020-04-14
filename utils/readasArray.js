const fs = require('fs')

var read = (file) => {
    var data = fs.readFileSync(file,'utf8').split('\n');

    var array = Array();

    data.forEach((str) => {
        array.push(str.slice(0,-1))
        console.log(str,str.slice(0,-1))
    });

    return array;
}
