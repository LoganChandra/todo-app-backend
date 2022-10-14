// EXTERNAL
import express from "express";
const { Op } = require("sequelize");

// INTERNAL
import { TaskInstance } from "../../model/task";
import { getStatus } from "../helpers"

export const update = async (req: express.Request, res: express.Response) => {
  try {

    let { id } = req.params
    let { name, description, dueDate } = req.body
    dueDate = new Date(dueDate)

    console.log("{ name, description, dueDate }", { name, description, dueDate });

    // INPUT ERROR HANDLING
    if (isNaN(dueDate.getTime())) {
      res.status(400).send({ data: null, msg: "Failed to add task", error: "Provided due date is not a valid date" });
      return
    }

    // GETTING STATUS
    let status = getStatus(dueDate)

    // UPDATE TASK
    await TaskInstance.update({ name, description, dueDate: dueDate.getTime(), status }, {
      where: {
        taskId: id
      }
    });

    // RETURN RESULT
    res.status(200).send({
      data: null,
      msg: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: [], msg: "Failed to update task" });
  }
};