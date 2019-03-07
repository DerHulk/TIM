import { ApplicationContext } from './applicationContext';
import { TaskController } from './taskController';
import { inbox } from "file-transfer";
import * as fs from "fs";

export function bindTask(appContext: ApplicationContext, controller: TaskController) {
    
     inbox.addEventListener("newfile", processAllFiles);
     processAllFiles();

};

function processAllFiles() {
    let fileName;
    while (fileName = inbox.nextFile()) {
      // process each file
      console.log("Received: " + fileName);
          
      let json_object  = fs.readFileSync(fileName, "json");
      console.log("JSON guid: " + json_object[2].id);
 
    }
 }
