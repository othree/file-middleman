(function(){
  var FileReader, BlobBuilder, Blob, URL, supports, dtob, base64ToArr, arrToBlob, base64ToBlob, dataurlToBlob, blobToDataurl, dataurlPostfix, FileM;
  FileReader = window.FileReader;
  BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
  Blob = window.Blob;
  URL = window.URL || window.webkitURL;
  supports = {
    blob: Blob != null,
    url: URL != null,
    blobURL: Blob != null && URL != null && !isSafari6,
    arrayBuffer: typeof ArrayBuffer != 'undefined' && ArrayBuffer !== null,
    read: FileReader != null,
    readAsArrayBuffer: FileReader != null && new FileReader().readAsArrayBuffer != null
  };
  dtob = function(dataurl){
    return dataurl.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/=]+)/)[3];
  };
  base64ToArr = function(base64){
    var data, arr, i$, len$, i, v;
    data = atob(base64);
    arr = new Uint8Array(data.length);
    for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
      i = i$;
      v = data[i$];
      arr[i] = data.charCodeAt(i);
    }
    return arr;
  };
  arrToBlob = function(arr, mime, arg1){
    var blobProp, blob, builder;
    if (Blob) {
      if (mime != null) {
        blobProp = {
          type: mime
        };
        blob = new Blob([arr], blobProp);
      } else {
        blob = new Blob([arr]);
      }
    } else {
      builder = new BlobBuilder();
      builder.append(arr.buffer);
      blob = builder.getBlob();
    }
    return blob;
  };
  base64ToBlob = compose(arrToBlob, base64ToArr);
  dataurlToBlob = compose(base64ToBlob, dtob);
  blobToDataurl = function(blob, mime, arg1){
    var _dfd, reader;
    _dfd = $.Deferred();
    reader = new FileReader();
    reader.onerror = _dfd.reject;
    reader.onload = function(){
      var dataurl;
      dataurl = reader.result + '';
      dataurl = dataurl.replace(/^data:;/, 'data:' + mime + ';');
      return _dfd.resolve(dataurl);
    };
    reader.readAsDataURL(blob);
    return _dfd.promise();
  };
  dataurlPostfix = function(dataURI){
    var fill, len, mod;
    fill = ['', '===', '==', '='];
    dataURI = _.str.trim(dataURI);
    len = dataURI.length;
    mod = len % 4;
    if (mod !== 0) {
      dataURI = dataURI + fill[mod];
    }
    return dataURI;
  };
  FileM = (function(){
    FileM.displayName = 'FileM';
    var prototype = FileM.prototype, constructor = FileM;
    function FileM(source){
      this.source = source;
    }
    prototype.toBlob = function(type, arg){
      return this.file;
    };
    prototype.toDataURL = function(type, arg){};
    return FileM;
  }());
}).call(this);
