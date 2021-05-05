const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Card extends Model {}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_des: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    event_location_lat: {
      // convert to float- parseInt
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_location_lon: {
      // convert to float- parseInt
      type: DataTypes.STRING,
      allowNull: true
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    event_time: {
      type: DataTypes.TIME,
      allowNull: false,
      default: "06:00",
    },
    categories_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "card",
    // hooks: {
    //   beforeSave: function (instance) {
    //     if (instance.event_location && !instance.event_location.crs) {
    //       instance.evnt_location.crs = {
    //         type: "name",
    //         properties: {
    //           name: "EPSG:4326",
    //         },
    //       };
    //     }
    //   },
    // },
  }
);

module.exports = Card;
