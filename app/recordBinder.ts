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

  let container = document.getElementById("container");
  let playButton = document.getElementById("playButton");
  let pauseButton = document.getElementById("pauseButton");
  let finishButton = document.getElementById("finishButton");
  let time = document.getElementById("mixedtext");
  let text = time.getElementById("copy");

  if(!controller.hasTask()){
   
    container.value = ApplicationContext.TaskListViewIndex;
    (<any>playButton).style.display = "none";
    (<any>finishButton).style.display = "none";
    text.text = "Select a task from list";
    time.text = "Please";
  }

  (<any>pauseButton).style.display = "none";

  playButton.onactivate = (evt) => {
    controller.start();
    (<any>playButton).style.display = "none";
    (<any>pauseButton).style.display = "inline";
  };
  pauseButton.onactivate = (evt) => {
    controller.pause();
    (<any>pauseButton).style.display = "none";
    (<any>playButton).style.display = "inline";
  };

  finishButton.onactivate = (evt) => {
    controller.pause();
    (<any>pauseButton).style.display = "none";
    (<any>playButton).style.display = "inline";
    container.value = ApplicationContext.TaskListViewIndex;
  };

  appContext.Emitter.add(ApplicationContext.OnUpdateElapseTime,
    (value:string) => {      
      time.text = value;     
    });

  appContext.Emitter.add(ApplicationContext.OnTaskSelected, (task:TaskEntity) => {
      
      text.text = task.titel;  
      
      if(controller.hasTask()){        
        container.value = ApplicationContext.MainViewIndex;
        (<any>playButton).style.display = "inline";
        (<any>finishButton).style.display = "inline";
      }
      
    });
}