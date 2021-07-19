function _XHR(){
    this.postDownload = function(param, url, filename){
       
       var xhr = new XMLHttpRequest();
        var link = document.createElement('a');
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "blob";
        xhr.onload = function (e) {
           if (navigator.appVersion.toString().indexOf('.NET') > 0){
              var blob = new Blob([xhr.response]);
                
              window.navigator.msSaveOrOpenBlob(blob, filename);   
           }
           else{      
              var blob = xhr.response;
                
                link.href=window.URL.createObjectURL(blob);
                link.download=filename;
                link.click();
           }
        }
        xhr.send(JSON.stringify(param));
    }
}

function xtableCsvToObject(csv){
    if(csv == null || csv == ''){
        return null;
    }

    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length-1;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
            obj[headers[j].replace(/"/gi,"")] = currentline[j].replace(/"/gi,"");
        }
        result.push(obj);
    }

    return result; 
}