import { me } from "device";
import * as document from "document";

let myList = <any> document.getElementById("my-list");   
myList.length = 100;


export function runMyApp(){
                         
    myList.delegate = {
        getTileInfo: function(index:number) {
            return {
              type: "my-pool",
              value: "Menu item",
              index: index
            };
          },
          configureTile: function(tile:any, info:any) {
            if (info.type == "my-pool") {

              var text = info.index  +  " and ..";

              tile.getElementById("text").text = text;
              let touch = tile.getElementById("touch-me");
              touch.onclick = (evt:any) => {
                console.log(`touched: $‌{info.index}`);
              };
            }
          }
    };


    console.log(me.firmwareVersion);  
}
