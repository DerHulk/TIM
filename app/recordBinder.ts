import clock from "clock";
import { display } from "display";
import { RecordController } from "./recordController"
import * as document from "document";
import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';

export function bindRecord(appContext: ApplicationContext,
  controller: RecordController) {

  clock.granularity = "seconds";
  clock.ontick = (evt) => controller.update();

  display.onchange = (evt) => {
    if (display.on)
      controller.update();
    // else
    //   appContext.WriteRecord(controller);
    
  };

  let playButton = document.getElementById("playButton");
  let pauseButton = document.getElementById("pauseButton");
  let finishButton = document.getElementById("finishButton");

  (<any>pauseButton).style.display = "none";

  playButton.onactivate = (evt) => {
    controller.start();
    (<any>playButton).style.display = "none";
    (<any>finishButton).style.display = "inline";
  };
  pauseButton.onactivate = (evt) => {
    controller.pause()
  };
  
  

  appContext.Emitter.add(ApplicationContext.OnUpdateElapseTime,
    (value:string) => {
      let mixedtext = document.getElementById("mixedtext");
      mixedtext.text = value;     
    });

    appContext.Emitter.add(ApplicationContext.OnTaskSelected, (task:TaskEntity) => {
      let mixedtext = document.getElementById("mixedtext");
      let body = mixedtext.getElementById("copy");

      body.text = task.titel;      
    });
}