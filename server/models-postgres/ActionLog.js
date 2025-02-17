import {DataTypes} from "sequelize";
import sequalize from "./dbPostgresConfig.js";

const ActionLog = sequalize.define("ActionLog", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
    }
}, {
    tableName: "Action_Logs",
    timestamps: true,
})

export default ActionLog;