import { Model, DataTypes } from "sequelize";

import db from "../../config/database.config";

export interface TaskAttributes {
  taskId: string;
  name: string;
  description: string;
  dueDate: number;
  createDate: Number;
  status: string;
}
export class TaskInstance extends Model<TaskAttributes> { }

// DEFINING THE TASK MODEL
TaskInstance.init(
  {
    taskId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    createDate: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: db,
    tableName: "task",
  }
);
