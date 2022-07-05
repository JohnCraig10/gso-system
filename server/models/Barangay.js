module.exports = (sequelize, DataTypes) => {
    const Barangay = sequelize.define(
        "Barangay",
        {
            barangayName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            populationCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Barangay;
};
