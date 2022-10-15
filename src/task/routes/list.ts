// EXTERNAL
import express from "express";
import { Op } from "sequelize";

// INTERNAL
import { TaskInstance } from "../../model/task";

export const list = async (req: express.Request, res: express.Response) => {
  try {

    // ASSIGNING INPUTS
    let { search } = req.query
    let page: number = parseInt(<string>req.query.page)
    let pageSize: number = parseInt(<string>req.query.pageSize)

    // LIST TASKS
    let tasks = await TaskInstance.findAll({
      where: { name: { [Op.like]: `%${search}%` } },
      offset: 0 + (page - 1) * pageSize,
      limit: pageSize
    });

    // COUNT OF ALL TASKS
    let totalCount = await TaskInstance.count({
      where: { name: { [Op.like]: `%${search}%` } }
    });

    // RETURN RESULT
    res.status(200).send({
      data: { totalCount, tasks },
      msg: "Task listed successfully",
    });
  } catch (error) {
    res.status(500).send({ data: [], msg: "Failed to list tasks" });
  }
};