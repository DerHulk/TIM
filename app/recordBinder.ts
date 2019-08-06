import { RecordController } from "./recordController"
import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';
import * as appEvent from './constant';


export function bindRecord(appContext: ApplicationContext,
  controller: RecordController) {

  appContext.device.onClockTick("seconds", (evt) => controller.update());
  appContext.device.onDisplayChange((evt) => {
    if (appContext.device.isDisplayOn)
        controller.update();
  });

  let container = appContext.device.getDocumentElementById("container");
  let playButton = appContext.device.getDocumentElementById("playButton");
  let pauseButton = appContext.device.getDocumentElementById("pauseButton");
  let finishButton = appContext.device.getDocumentElementById("finishButton");
  let time = appContext.device.getDocumentElementById("mixedtext");
  let text = time.getElementById("copy");

  if (!controller.hasTask()) {

    container.value = ApplicationContext.TaskListViewIndex;
    (<any>playButton).style.display = "none";
    (<any>finishButton).style.display = "none";
    text.text = "Select a task from list";
    time.text = "Please";
  }

  (<any>pauseButton).style.display = "none";

  playButton.onactivate = (evt:any) => {
    controller.start();
    (<any>playButton).style.display = "none";
    (<any>pauseButton).style.display = "inline";
  };
  pauseButton.onactivate = (evt:any) => {
    controller.pause();
    (<any>pauseButton).style.display = "none";
    (<any>playButton).style.display = "inline";
  };

  finishButton.onactivate = (evt:any) => {
    controller.finished();
    (<any>pauseButton).style.display = "none";
    (<any>playButton).style.display = "inline";
    container.value = ApplicationContext.TaskListViewIndex;
  };

  appContext.Emitter.add(appEvent.OnUpdateElapseTime,
    (value: string) => {
      time.text = value;
    });

  appContext.Emitter.add(appEvent.OnTaskSelected, (task: TaskEntity) => {

    text.text = task.titel;

    if (controller.hasTask()) {
      container.value = ApplicationContext.MainViewIndex;
      (<any>playButton).style.display = "inline";
      (<any>finishButton).style.display = "inline";
    }

  });
}