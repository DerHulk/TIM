
export class ArrayBufferHelper {

    public static ObjectToBuffer(obj:object){
        var json = JSON.stringify(obj);
        return this.StringToBuffer(json);
    }

    public static BufferToObject<T>(buf:ArrayBuffer,useTrim:boolean = false){
        var jsonString = this.BufferToString(buf, useTrim) ; 
        var result = <T>JSON.parse(jsonString);                  
        
        return result;
    }

    public static StringToBuffer(str:string) :ArrayBuffer {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }      

      public static BufferToString(buf:ArrayBuffer, useTrim:boolean = false):string {
        
        var result = String.fromCharCode.apply(null, new Uint8Array(buf));

        if(!useTrim)
          return result;

        //hack we got some strange null-chars if we get a message from the device.
        return result.substr(0, result.lastIndexOf('}') +1);
      }            
}