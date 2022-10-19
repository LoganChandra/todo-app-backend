import request from "supertest";
import { assert, expect } from "chai"
import chai from "chai"
import { app } from "../../../app";
import { serialize } from "../../helpers";
import { Op } from "sequelize";
import { TaskInstance } from "../../../src/model/task";
import { uuid } from "uuidv4";


// DEFINE testTaskID FOR CLEAN UP
const testTaskId = uuid();

(async () => {

    // CREATE TASK
    await TaskInstance.create({
        taskId: testTaskId,
        name: "",
        description: "",
        dueDate: new Date().getTime(),
        createDate: new Date().getTime(),
        status: "Due soon"
    });

})()

describe("Task routes", async () => {

    // TEST FOR RETURN 200
    // ------------ TEST LIST TASK ------------
    it("List task responds with 200", (done) => {

        request(app).get(`/task?${serialize({
            search: "",
            page: 1,
            pageSize: 10,
        })}`).expect(200, done)

    })

    // ------------ TEST ADD TASK ------------
    it("Add task responds with 200", (done) => {

        let payload = {
            name: `${testTaskId} :: Test add task name`,
            description: "Test add task description",
            dueDate: "01-01-1970"
        }
        request(app).post("/task").send(payload).expect(200, done)

    })

    // ------------ TEST UPDATE TASK ------------
    it("Update task responds with 200", (done) => {

        let payload = {
            name: `${testTaskId} :: Test update task name`,
            description: "Test update task description",
            dueDate: "01-01-1970"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(200, done)

    })

    // TEST FOR RETURN 400 ON INVALID DATE
    // ------------ TEST UPDATE ------------
    it("Update task responds with 400 with invalid date", (done) => {

        let payload = {
            name: "Test update task name",
            description: "Test update task description",
            dueDate: "invalid date string"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(400, done)

    })

    // ------------ TEST ADD ------------
    it("Add task responds with 400 with invalid date", (done) => {

        let payload = {
            name: `${testTaskId} :: Test add task name`,
            description: "Test add task description",
            dueDate: "invalid date string"
        }
        request(app).post("/task").send(payload).expect(400, done)

    })

    // TEST FOR RETURN 400 ON INVALID PAYLOAD
    // ------------ TEST UPDATE ------------
    it("Update task responds with 400 with invalid payload", (done) => {

        let payload = {
            invalid: "payload"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(400, done)

    })

    // ------------ TEST ADD ------------
    it("Add task responds with 400 with invalid payload", (done) => {

        let payload = {
            invalid: "payload"
        }
        request(app).post("/task").send(payload).expect(400, done)

    })

    // TEST FOR RETURN 404
    // ------------ TEST UPDATE ------------
    it("Update task responds with 404 is invalid route", (done) => {

        let payload = {
            name: "Test update task name",
            description: "Test update task description",
            dueDate: "01-01-1970"
        }
        request(app).patch(`/invalid_path/${testTaskId}`).send(payload).expect(404, done)

    })

    // ------------ TEST ADD ------------
    it("Add task responds with 404 is invalid route", (done) => {

        let payload = {
            name: "Test add task name",
            description: "Test add task description",
            dueDate: "01-01-1970"
        }
        request(app).post("/invalid_path").send(payload).expect(404, done)

    })

    // ------------ TEST FOR LIST PAYLOAD ------------
    it("List task responds with correct payload", (done) => {
        let pageSize = 10
        request(app).get(`/task?${serialize({
            search: "",
            page: 1,
            pageSize,
        })}`).expect(200)
            .expect((res) => {

                // CHECK IF PAYLOAD KEYS ARE CORRECT
                let stringifyPayload = JSON.stringify(Object.keys(res.body.data.tasks[0]))
                let expectedStringifyPayload = JSON.stringify(["taskId", "name", "description", "dueDate", "createDate", "status", "createdAt", "updatedAt"])
                expect(stringifyPayload).to.be.equal(expectedStringifyPayload);

            })
            .expect((res) => {

                // CHECK IF PAYLOAD LENGTH IS SAME AS REQUESTED
                expect(res.body.data.tasks.length).to.be.equal(pageSize);

            })
            .end(done);
    })

    // ------------ TEST FOR ADD PAYLOAD ------------
    it("Add task adds database correctly", (done) => {

        let name = `${testTaskId} :: Test add task name`

        // TEST LIST CORRECT TASK
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize: 10,
        })}`)
            .expect((res) => {

                // CHECK IF PAYLOAD KEYS ARE CORRECT
                let data = res.body.data.tasks[0]
                expect(data.name).to.be.equal(name);

            })
            .end(done);

    })

    // ------------ TEST FOR UPDATE PAYLOAD ------------
    it("Add task updates database correctly", (done) => {
        let name = `${testTaskId} :: Test update task name`

        // TEST LIST CORRECT TASK
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize: 10,
        })}`)
            .expect((res) => {

                // CHECK IF PAYLOAD KEYS ARE CORRECT
                let data = res.body.data.tasks[0]
                expect(data.name).to.be.equal(name);

            })
            .end(done);

    })

})
