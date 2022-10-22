// EXTERNAL
import express from "express";
import { Op } from "sequelize";

// INTERNAL
import { TaskInstance } from "../../model/task";

export const update = async (req: express.Request, res: express.Response) => {
  try {

    // ASSIGNING INPUTS
    let { id } = req.params
    let { name, description, dueDate } = req.body
    dueDate = new Date(dueDate)

    // INPUT ERROR HANDLING
    if (isNaN(dueDate.getTime())) {
      res.status(400).send({ data: null, msg: "Failed to add task", error: "Provided due date is not a valid date" });
      return
    }

    let taskCount = await TaskInstance.count({
      where: { taskId: { [Op.eq]: id } }
    })

    // CHECK IF TASK EXISTS
    if (taskCount < 1) {
      res.status(400).send({ data: null, msg: "Task does not exist" });
      return
    }

    // UPDATE TASK
    await TaskInstance.update({ name, description, dueDate: dueDate.getTime() }, {
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
    res.status(500).send({ data: null, msg: "Failed to update task" });
  }
};