const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { Barangay } = require("../models");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
// const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { validate } = require("../middleware/auth");
const { validateUser } = require("../middleware/user");
// const { default: auth, validateUser, validate } = require("../middleware/auth");

router.get("/", async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post("/", async (req, res) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        barangayName,
        isAdmin,
    } = req.body;
    // const barangay = await Barangay.findOne({ where: { id: barangayId } });

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = null;

    if (!isAdmin) {
        const barangay = await Barangay.findOne({
            where: { barangayName: barangayName },
        });

        user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword,
            barangayId: barangay.id,
            barangayName: barangayName,
            isAdmin: isAdmin,
        });

        await Barangay.update(
            { userId: user.id },
            { where: { id: barangay.id } }
        );
    } else {
        user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword,
            barangayId: null,
            barangayName: null,
            isAdmin: isAdmin,
        });
    }

    res.json(user);

    // bcrypt.hash(password, 10).then((hashedPassword) => {
    //     const user = await User.create({
    //         firstName: firstName,
    //         lastName: lastName,
    //         username: username,
    //         email: email,
    //         password: hashedPassword,
    //     });
    //     res.json(user);
    // });

    // const user = req.body;
    // await User.create(user);
    // res.json(user);
});

router.get("/barangay", async (req, res) => {
    const userBarangays = await Barangay.findAll({
        where: {
            userId: null,
        },
    });

    res.json(userBarangays);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username.length < 1)
        return res.json({ error: "Username must not be empty" });
    if (password.length < 1)
        return res.json({ error: "Password must not be empty" });

    const user = await User.findOne({ where: { username: username } });

    // attributes: { exclude: ["email"] }
    if (!user) return res.json({ error: "Couldn't find your account" });

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return res.json({ error: "Password is incorrect" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7 * 4, // around 1 month
            path: "/",
        })
    );

    const userWithoutPassword = await User.findOne({
        attributes: { exclude: ["password"] },
        where: { username: username },
    });

    return res.json(userWithoutPassword);
});

// router.get("/auth", validateToken, (req, res) => {
//     res.json(req.user);
// });

const me = (req, res) => {
    return res.json(res.locals.user);
};

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

router.get("/me", validateUser, validate, me);
router.get("/logout", validateUser, validate, logout);

module.exports = router;
