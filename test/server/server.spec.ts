import request from "supertest";
import { expect } from "chai"
import { app } from "../../app";

describe("SERVER CHECKS", () => {
    it("Server has been created successfully", (done) => {
        request(app).get("/").expect(200, done)
    })
})
