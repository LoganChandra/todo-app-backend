import request from "supertest";
import { expect } from "chai"
import { app } from "../../../app";
import { serialize } from "../../helpers";

describe("Task routes", () => {
    it("List task responds with 200", (done) => {
        request(app).get(`/task?${serialize({
            search: "",
            page: 1,
            pageSize: 10,
        })}`).expect(200, done)
    })

    it("Update task responds with 200", (done) => {
        let id = "dcf2e230-7876-44a0-968a-4137493f43ef"
        let payload = {
            name: "Test update task name",
            description: "Test update task description",
            dueDate: "01-01-1970"
        }
        request(app).patch(`/task/${id}`).send(payload).expect(200, done)
    })

    it("Add task responds with 200", (done) => {
        let payload = {
            name: "Test add task name",
            description: "Test add task description",
            dueDate: "01-01-1970"
        }
        request(app).post("/task").send(payload).expect(200, done)
    })
})
