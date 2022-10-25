import request from "supertest";
import { expect } from "chai"
import chai from "chai"
import { app } from "../../../app";
import { createTestTasks, serialize } from "../../helpers";
import { Op } from "sequelize";
import { TaskInstance } from "../../../src/model/task";
import { uuid } from "uuidv4";


// DEFINING testTaskID FOR CLEAN UP
const testTaskId = uuid();

// DELETE TEST TASKS AFTER EACH TEST
after(async () => {
    await TaskInstance.destroy({
        where: {
            name: {
                [Op.like]: `%${testTaskId}%`
            }
        }
    });
});

// ROUTES RETURN 200
describe("ROUTES RETURN 200", async () => {

    // ------------ LIST ------------
    it("List task responds with 200", (done) => {

        request(app).get(`/task?${serialize({
            search: "",
            page: 1,
            pageSize: 10,
        })}`).expect(200, done)

    })

    // ------------ ADD ------------
    it("Add task responds with 200", (done) => {

        let payload = {
            name: `${testTaskId} :: Test add task name`,
            description: "Test add task description",
            dueDate: "01-01-1970"
        }
        request(app).post("/task").send(payload).expect(200, done)

    })

});

// UPDATE ROUTE RETURN 200
describe("UPDATE ROUTE RETURN 200", async () => {

    before(() => {
        createTestTasks(testTaskId, 1, "", testTaskId)
    })

    // ------------ UPDATE ------------
    it("Update task responds with 200", (done) => {

        let payload = {
            name: `${testTaskId} :: Test update task name`,
            description: "Test update task description",
            dueDate: "01-01-1970"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(200, done)

    })

});

// ROUTES RETURN 400
describe("ROUTES RETURN 400", async () => {

    // ------------ UPDATE ------------
    it("Update task responds with 400 with invalid date", (done) => {

        let payload = {
            name: "Test update task name",
            description: "Test update task description",
            dueDate: "invalid date string"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(400, done)

    })

    // ------------ UPDATE ------------
    it("Update task responds with 400 with invalid date", (done) => {

        let payload = {
            name: "Test update task name",
            description: "Test update task description",
            dueDate: "invalid date string"
        }
        request(app).patch(`/task/invalid_id`).send(payload).expect(400, done)

    })

    // ------------ ADD ------------
    it("Add task responds with 400 with invalid date", (done) => {

        let payload = {
            name: `${testTaskId} :: Test add task name`,
            description: "Test add task description",
            dueDate: "invalid date string"
        }
        request(app).post("/task").send(payload).expect(400, done)

    })

});

// ROUTES RETURN 400 ON INVALID PAYLOAD
describe("ROUTES RETURN 400 ON INVALID PAYLOAD", async () => {

    // ------------ LIST ------------
    it("List task responds with 400 with invalid payload", (done) => {

        request(app).get(`/task?${serialize({
            invalid: "payload"
        })}`).expect(400, done)

    })

    // ------------ UPDATE ------------
    it("Update task responds with 400 with invalid payload", (done) => {

        let payload = {
            invalid: "payload"
        }
        request(app).patch(`/task/${testTaskId}`).send(payload).expect(400, done)

    })

    // ------------ ADD ------------
    it("Add task responds with 400 with invalid payload", (done) => {

        let payload = {
            invalid: "payload"
        }
        request(app).post("/task").send(payload).expect(400, done)

    })

});

// API RETURNS 404 AT INVALID ROUTE
describe("API RETURNS 404 AT INVALID ROUTE", async () => {

    it("API responds with 404 is invalid route", (done) => {

        request(app).get(`/invalid_path`).expect(404, done)

    })

})

// API RETURNS CORRECT PAYLOAD
describe("API RETURNS CORRECT PAYLOAD", async () => {
    // CREATING DUMMY TASKS
    let addPostfix = " :: Test add task name"
    let updatePostfix = " :: Test update task name"

    before(() => {

        // CHECKING LIST, ADD AND UPDATE
        createTestTasks(testTaskId, 11, "")
        createTestTasks(testTaskId, 1, addPostfix)
        createTestTasks(testTaskId, 1, updatePostfix)

    })

    // ------------ LIST ------------
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
                let expectedStringifyPayload = JSON.stringify(["taskId", "name", "description", "dueDate", "createDate", "createdAt", "updatedAt", "status"])
                expect(stringifyPayload).to.be.equal(expectedStringifyPayload);

            })
            .expect((res) => {

                // CHECK IF PAYLOAD LENGTH IS SAME AS REQUESTED
                expect(res.body.data.tasks.length).to.be.equal(pageSize);

            })
            .end(done);

    })

    // ------------ ADD ------------
    it("Add task adds database correctly", (done) => {

        let name = `${testTaskId}0${addPostfix}`
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize: 10,
        })}`)
            .expect((res) => {

                let data = res.body.data.tasks[0]
                expect(data.name).to.be.equal(name);

            })
            .end(done);

    })

    // ------------ UPDATE ------------
    it("Update task updates database correctly", (done) => {

        const name = `${testTaskId}0${updatePostfix}`
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

// API RETURNS CORRECT TASK STATUS
describe("API RETURNS CORRECT TASK STATUS", async () => {

    // CREATING DUMMY TASKS
    let overduePostfix = " :: This task is Overdue"
    let dueSoonPostfix = " :: This task is Due soon"
    let notUrgentPostfix = " :: This task is Not urgent"

    // DEFINING DATES
    let overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() + -1);

    let dueSoonDate = new Date();
    dueSoonDate.setDate(dueSoonDate.getDate() + 7);

    let notUrgentDate = new Date();
    notUrgentDate.setDate(notUrgentDate.getDate() + 8);

    before(() => {

        // CHECKING TASK STATUS
        createTestTasks(testTaskId, 1, overduePostfix, undefined, overdueDate)
        createTestTasks(testTaskId, 1, dueSoonPostfix, undefined, dueSoonDate)
        createTestTasks(testTaskId, 1, notUrgentPostfix, undefined, notUrgentDate)

    })

    // ------------ LIST ------------
    it("List task responds with \"Overdue\" status", (done) => {

        let pageSize = 1
        let name = `${testTaskId}0${overduePostfix}`
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize,
        })}`).expect(200)

            .expect((res) => {

                // CHECK TASK STATUS
                let data = res.body.data.tasks[0]
                expect(data.status).to.be.equal("Overdue");

            })
            .end(done);

    })

    // ------------ LIST ------------
    it("List task responds with \"Due soon\" status", (done) => {

        let pageSize = 1
        let name = `${testTaskId}0${dueSoonPostfix}`
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize,
        })}`).expect(200)
            .expect((res) => {

                // CHECK TASK STATUS
                let data = res.body.data.tasks[0]
                expect(data.status).to.be.equal("Due soon");

            })
            .end(done);

    })

    // ------------ LIST ------------
    it("List task responds with \"Not urgent\" status", (done) => {

        let pageSize = 1
        let name = `${testTaskId}0${notUrgentPostfix}`
        request(app).get(`/task?${serialize({
            search: name,
            page: 1,
            pageSize,
        })}`).expect(200)
            .expect((res) => {

                // CHECK TASK STATUS
                let data = res.body.data.tasks[0]
                expect(data.status).to.be.equal("Not urgent");

            })
            .end(done);

    })

})
