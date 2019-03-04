import { runMyApp } from "./main";
import {  RecordController } from "./recordController";
import {  ApplicationContext } from "./applicationContext";
import { bindRecord } from './recordBinder';
import { inbox } from "file-transfer";
import * as fs from "fs";


runMyApp();
let appContext = new ApplicationContext();
let recordController = new RecordController(appContext);

bindRecord( appContext, recordController);



function processAllFiles() {
   let fileName;
   while (fileName = inbox.nextFile()) {
     // process each file
     console.log("Received: " + fileName);
         
     let json_object  = fs.readFileSync(fileName, "json");
     console.log("JSON guid: " + json_object[2].id);

   }
}
inbox.addEventListener("newfile", processAllFiles);
processAllFiles();