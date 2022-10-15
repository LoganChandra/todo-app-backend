// EXTERNAL
import express from "express";
import { OrderItem } from "sequelize/types";
const { Op } = require("sequelize");

// INTERNAL
import { TaskInstance } from "../../model/task";

export const list = async (req: express.Request, res: express.Response) => {
  try {

    // ASSIGNING INPUTS
    let { search } = req.query

    // LIST TASKS
    let tasks = await TaskInstance.findAll({
      where: { name: { [Op.like]: `%${search}%` } },
    });

    // RETURN RESULT
    res.status(200).send({
      data: tasks,
      msg: "Task listed successfully",
    });
  } catch (error) {
    res.status(500).send({ data: [], msg: "Failed to list tasks" });
  }
};