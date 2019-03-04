
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";

export class CompanionController {

    constructor() {

    }

    public syncTasks() {

        var url = JSON.parse(settingsStorage.getItem("ServerUrl")).name;
        console.log("Url:"+ url);

        fetch(url).then(function (response) {           
            return response.arrayBuffer();
        }).then(function (arrayBuffer) {
            //console.log("Got JSON response from server:" + JSON.stringify(json));

            outbox.enqueue("task.json", arrayBuffer)
                .then((ft:any) => {
                    console.log('Transfer of ' + ft.name  + ' successfully queued.');
                })
                .catch((error) => {
                    console.log(`Failed to queue $‌{filename}: $‌{error}`);
                });

        }).catch(function (error) {
            console.log("fetched faild:" + error);
        });
    }
}