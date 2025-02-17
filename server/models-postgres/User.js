import { DataTypes } from "sequelize";
import sequelize from "./dbPostgresConfig.js";

const Users = sequelize.define("Users", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    activationLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "Users",
    timestamps: true,
});

export default Users;