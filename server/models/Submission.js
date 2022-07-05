module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define(
        "Submission",
        {
            documentName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            populationCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            barangayId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            barangayName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Submission;
};
