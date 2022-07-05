const validate = async (req, res, next) => {
    try {
        const user = res.locals.user;

        // console.log("USER --->", user);

        // if (!user) throw new Error("Unauthenticated");
        // if (!user) return res.json({ error: "Unauthenticated" });

        if (!user) {
            return res.status(401).json({ error: "Unauthenticated TEST" });
        }

        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthenticated" });
    }
};

module.exports = { validate };
