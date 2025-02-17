import {DataTypes} from "sequelize";
import sequelize from "./dbPostgresConfig.js";
import Users from "./User.js";


const TokenSchema = sequelize.define("Token", {
    userId: { // это внешний ключ
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users, // ссылка на модель User
            key: "id",         // ключ, на который ссылается внешний ключ (ну да так это работает)
        },
    },
    refreshToken: {type: DataTypes.STRING, allowNull: true,},
}, {
    timestamps: true,
})

// связь между TokenSchema и UserSchema (User)
TokenSchema.belongsTo(Users, { foreignKey: "userId" });

export default TokenSchema;
