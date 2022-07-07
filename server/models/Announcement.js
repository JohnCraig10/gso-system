module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define(
        "Announcement",
        {
            announcementText: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            announcementImageUrl: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            barangayName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Announcement;
};
