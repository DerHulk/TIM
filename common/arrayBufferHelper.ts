
export class ArrayBufferHelper {

    public static ObjectToBuffer(obj:object){
        var json = JSON.stringify(obj);
        return this.StringToBuffer(json);
    }

    public static BufferToObject<T>(buf:ArrayBuffer){
        var json = this.BufferToString(buf);

        return <T>JSON.parse(json);
    }

    public static StringToBuffer(str:string) :ArrayBuffer {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }      

      public static BufferToString(buf:ArrayBuffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      }      
}