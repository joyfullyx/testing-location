const Sequelize = require('sequelize');
// const wkx = require('wkx')
// Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
//   return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
//   return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
//   return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
//   return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }

require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      legacySpatialSupport: true,
      port: 3306
    }
  );
}

module.exports = sequelize;