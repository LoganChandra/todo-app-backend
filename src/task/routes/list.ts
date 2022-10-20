// EXTERNAL
import express from "express";
import { Op } from "sequelize";

// INTERNAL
import { TaskInstance } from "../../model/task";

export const list = async (req: express.Request, res: express.Response) => {
  try {

    // ASSIGNING INPUTS
    let { search } = req.query

    if (!req.query.page || !req.query.pageSize) {
      res.status(400).send({
        data: { totalCount: 0, tasks: [] },
        msg: "Failed to list tasks",
      });
      return
    }

    let page: number = parseInt(<string>req.query.page)
    let pageSize: number = parseInt(<string>req.query.pageSize)

    // LIST TASKS
    let where = { name: { [Op.like]: `%${search}%` } }
    let tasks = await TaskInstance.findAll({
      where,
      offset: 0 + (page - 1) * pageSize,
      limit: pageSize,
      order: [
        ['createDate', 'DESC']
      ]
    });

    // COUNT OF ALL TASKS
    let totalCount = await TaskInstance.count({ where });

    // RETURN RESULT
    res.status(200).send({
      data: { totalCount, tasks },
      msg: "Task listed successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ data: [], msg: "Failed to list tasks" });
  }
};