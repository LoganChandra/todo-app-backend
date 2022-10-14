// EXTERNAL
import express from "express";
import { OrderItem } from "sequelize/types";
const { Op } = require("sequelize");

// INTERNAL
import { TaskInstance } from "../../model/task";

export const list = async (req: express.Request, res: express.Response) => {
  try {

    let { descDueDate, descCreateDate, search } = req.query

    // CONVERTING STRING TO BOOL
    let sortDescDueDate = descDueDate == "null" ? null : descDueDate == "true"
    let sortDescCreateDate = descCreateDate == "null" ? null : descCreateDate == "true"

    // LIST TASKS
    let tasks = await TaskInstance.findAll({
      where: { name: { [Op.like]: `%${search}%` } },
      order: defineOrder({ sortDescDueDate, sortDescCreateDate })
    });

    // RETURN RESULT
    res.status(200).send({
      data: tasks,
      msg: "Task listed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: [], msg: "Failed to list tasks" });
  }
};

const defineOrder = ({ sortDescDueDate, sortDescCreateDate }): OrderItem[] => {
  let order: OrderItem[] = []

  // IF DueDate NOT NULL PUSH TO ORDER ITEM
  if (sortDescDueDate != null)
    order.push(['dueDate', sortDescDueDate ? 'DESC' : 'ASC'])

  // IF CreateDate NOT NULL PUSH TO ORDER ITEM
  if (sortDescCreateDate != null)
    order.push(['createDate', sortDescCreateDate ? 'DESC' : 'ASC'])

  return order
}