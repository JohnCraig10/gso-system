const express = require("express");
const router = express.Router();
const { Barangay } = require("../models");
const { User } = require("../models");

router.get("/", async (req, res) => {
    const barangays = await Barangay.findAll();
    res.json(barangays);
});

router.get("/user", async (req, res) => {
    const barangayUsers = await User.findAll({
        where: {
            barangayId: null,
        },
    });

    res.json(barangayUsers);
});

router.post("/barangay", async (req, res) => {
    const { userId } = req.body;
    const barangay = await Barangay.findOne({
        where: {
            userId: userId,
        },
    });
    res.json(barangay);
});

router.post("/", async (req, res) => {
    const { barangayName } = req.body;

    const barangay = await Barangay.create({
        barangayName: barangayName,
    });

    // await User.update(
    //     { barangayId: barangay.id, barangayName: barangayName },
    //     { where: { id: userId } }
    // );

    res.json(barangay);
});

router.put("/update", async (req, res) => {
    const { populationCount, userId } = req.body;

    await Barangay.update(
        { populationCount: populationCount },
        { where: { userId: userId } }
    );
    res.json("SUCCESS");
});

module.exports = router;
