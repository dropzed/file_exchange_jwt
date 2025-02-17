import {DataTypes} from 'sequelize';
import sequelize from "./dbPostgresConfig.js";
import Users from "./User.js";


const File = sequelize.define("File", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publicUrl: {
        type: DataTypes.STRING,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Users",
            key: "id",
        }
    },
}, {
    tableName: "files",
    timestamps: true,
})


// установка связи
Users.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(Users, { foreignKey: 'userId' });

export default File;