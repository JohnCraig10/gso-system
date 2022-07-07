const express = require("express");
const { validate } = require("../middleware/auth");
const { validateUser } = require("../middleware/user");
const router = express.Router();
const { Announcement } = require("../models");

// router.get("/", async (req, res) => {
//     const barangays = await Barangay.findAll();
//     res.json(barangays);
// });

const getAnnouncements = async (req, res) => {
    const announcements = await Announcement.findAll({
        order: [["createdAt", "DESC"]],
    });
    return res.json(announcements);
};

const getAnnouncement = async (req, res) => {
    const announcementId = req.params.announcementId;
    const announcement = await Announcement.findOne({
        where: {
            id: announcementId,
        },
    });

    return res.json(announcement);
};

const createAnnouncement = async (req, res) => {
    const { text, imageUrl } = req.body;

    const user = res.locals.user;

    // console.log(user);

    const announcement = await Announcement.create({
        announcementText: text,
        announcementImageUrl: imageUrl,
        username: user.username,
        barangayName: user.barangayName,
    });

    return res.json(announcement);
};

router.get("/", getAnnouncements);
router.get("/:announcementId", getAnnouncement);
router.post("/create", validateUser, validate, createAnnouncement);

module.exports = router;
