
FileReader = window.FileReader
BlobBuilder = window.BlobBuilder or window.MozBlobBuilder or window.WebKitBlobBuilder or window.MSBlobBuilder
Blob = window.Blob
URL = window.URL or window.webkitURL

supports =
  blob: (Blob?)
  url: (URL?)
  blobURL: (Blob? and URL?)
  arrayBuffer: (ArrayBuffer?)
  read: (FileReader?)
  readAsArrayBuffer: (FileReader? and (new FileReader()).readAsArrayBuffer?)

dtob = (dataurl) ->
  return dataurl.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/=]+)/)[3]

base64ToArr = (base64) ->
  data = atob(base64)

  arr = new Uint8Array(data.length)
  for v, i in data
    arr[i] = data.charCodeAt(i) 

  return arr

arrToBlob = (arr, args) ->
  args = [args] if typeof! args isnt 'Array'
  mime = args[0]
  arg1 = args[1]
  if Blob
    if mime?
      blobProp = {type: mime}
      blob = new Blob([arr], blobProp)
    else
      blob = new Blob([arr])
  else
    builder = new BlobBuilder()
    builder.append arr.buffer
    blob = builder.getBlob()

  return blob

base64ToBlob = compose arrToBlob, base64ToArr
dataurlToBlob = compose base64ToBlob, dtob

blobToDataurl = (blob, args, callback, fcallback) ->
  # return if not supports.blob
  args = [args] if typeof! args isnt 'Array'
  mime = args[0]
  reader = new FileReader()
  reader.onerror = fcallback
  reader.onload = ((mime, callback) ->
    return ->
      dataurl = reader.result + ''
      dataurl = dataurl.replace( /^data:;/ , 'data:'+mime+';' )
      callback(dataurl)
  )(mime, callback)

  reader.readAsDataURL(blob)

  return

# dataurl <-> base64 <-> arrayBuffer <-> blob

dataurlPostfix = (dataURI) ->
  fill = ['', '===', '==', '=']
  dataURI = _.str.trim dataURI
  len = dataURI.length
  mod = len % 4
  dataURI = dataURI + fill[mod] if mod isnt 0
  dataURI

class FileM # File Middle Man
  (@source, mime, arg1, dataurl) ->
    return @from(@srouce, mime, arg1, dataurl)

  from(data, mime, arg1, dataurl)
    return @fromElement(data) if data.nodeName and data.toBlob
    return @fromBlob(data) if data instanceof Blob
    return @fromArr(data) if data instanceof ArrayBuffer
    return false
    
  toBlob: (callback, mime, arg1) ->

  toDataURL: (mime, arg1) ->

window.FileM = FileM

