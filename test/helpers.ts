import { uuid } from "uuidv4";
import { TaskInstance } from "../src/model/task";

export const serialize = function (obj) {
    let str: Array<string> = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export const createTestTasks = (async (testTaskId: string, n: number, postfix: string, taskId?: string) => {

    // CREATE n TASKS FOR TESTING
    let createTaskPromiseArray = [...Array(n).keys()].map(e => {
        return TaskInstance.create({
            taskId: taskId != undefined ? taskId : uuid(),
            name: `${taskId != undefined ? taskId : testTaskId}${e}${postfix}`,
            description: "",
            dueDate: new Date().getTime(),
            createDate: new Date().getTime(),
            status: "Due soon"
        });
    })
    await Promise.all(createTaskPromiseArray)

})