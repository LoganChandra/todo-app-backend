// EXTRENAL
import express from "express";
import { uuid } from 'uuidv4';

// INTERNAL
import { TaskInstance } from "../../model/task";
import { getStatus } from "../helpers"

export const add = async (req: express.Request, res: express.Response) => {
  try {

    // ASSIGNING INPUTS
    let { name, description, dueDate } = req.body
    dueDate = new Date(dueDate)

    // INPUT ERROR HANDLING
    if (isNaN(dueDate.getTime())) {
      res.status(400).send({ data: null, msg: "Failed to add task", error: "Provided due date is not a valid date" });
      return
    }

    // CREATE TASK
    await TaskInstance.create({
      taskId: uuid(),
      name,
      description,
      dueDate: dueDate.getTime(),
      createDate: new Date().getTime()
    });

    // RETURN RESULT
    res.status(200).send({
      data: null,
      msg: "Task add successfully",
      error: null
    });
  } catch (error) {
    res.status(500).send({ data: null, msg: "Failed to add task", error });
  }
};
