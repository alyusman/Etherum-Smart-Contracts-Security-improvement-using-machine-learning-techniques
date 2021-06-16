/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('report', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    fileId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    isAccess: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    isDos: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    isUnchecked: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    accessPerc: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    dosPerc: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    uncheckedPerc: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
    },
  }, {
    tableName: 'report',
  });
};
