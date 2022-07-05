const express = require("express");
const { validate } = require("../middleware/auth");
const { validateUser } = require("../middleware/user");
const router = express.Router();
const { Submission } = require("../models");
const { Barangay } = require("../models");
const sequelize = require("sequelize");

router.get("/", async (req, res) => {
    const submissions = await Submission.findAll({
        attributes: [
            "id",
            "barangayName",
            "documentName",
            "populationCount",
            "createdAt",
            [
                sequelize.literal(
                    "(RANK() OVER (PARTITION BY barangayName ORDER BY createdAt DESC))"
                ),
                "rank",
            ],
        ],
    });

    res.json(submissions);
});

router.get("/all", async (req, res) => {
    const submissions = await Submission.findAll({
        // group: "barangayName",
        // order: [["createdAt", "ASC"]],
    });

    res.json(submissions);
});

// router.post("/", async (req, res) => {
//     const submission = req.body;
//     await Submission.create(submission);
//     res.json(submission);
// });

router.post("/submit", async (req, res) => {
    const { documentName, populationCount, userId } = req.body;

    const barangay = await Barangay.findOne({
        where: { userId: userId },
    });

    const submission = await Submission.create({
        documentName: documentName,
        populationCount: populationCount,
        userId: userId,
        barangayId: barangay.id,
        barangayName: barangay.barangayName,
    });

    // const barangay = await Barangay.create({barangayName,
    //     populationCount: 0,
    // });

    // barangay.populationCount = populationCount;

    // barangay = await barangay.save();

    // await Barangay.upsert({
    //     id: barangayId,
    //     populationCount: populationCount,
    // });

    res.json(submission);
});

router.post("/download", (req, res) => {
    const { fileName } = req.body;
    // res.json(fileName);
    res.download(`./public/submissions/${fileName}`);
});

// router.post("/", async (req, res) => {
//     const { firstName, lastName, username, email, password } = req.body;
//     bcrypt.hash(password, 10).then((hashedPassword) => {
//         User.create({
//             firstName: firstName,
//             lastName: lastName,
//             username: username,
//             email: email,
//             password: hashedPassword,
//         });
//         res.json("SUCCESS");
//     });
//     // const user = req.body;
//     // await User.create(user);
//     // res.json(user);
// });

const logout = (req, res) => {
    res.set(
        "Set-Cookie",
        cookie.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        })
    );

    return res.status(200).json({ success: true });
};

const getSubmissions = async (req, res) => {
    const user = res.locals.user;
    // console.log("USER ------>HEHE", user.id);

    const submissions = await Submission.findAll({
        where: {
            userId: user.id,
        },
    });

    res.json(submissions);
};

// router.post("/submissions", async (req, res) => {
//     const { userId } = req.body;

//     const submissions = await Submission.findAll({
//         where: {
//             userId: userId,
//         },
//     });

//     res.json(submissions);
// });

router.get("/submissions", validateUser, validate, getSubmissions);

module.exports = router;
