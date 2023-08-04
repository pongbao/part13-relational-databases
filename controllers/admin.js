const router = require("express").Router();
const User = require("../models/user");
const UserSession = require("../models/user_session");

const { tokenExtractor } = require("../util/middleware");

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

router.put("/:username", tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  const session = await UserSession.findOne({
    where: {
      user_id: user.id,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    console.log(req.body.disabled);
    await user.save();
    session.token = null;
    await session.save();
    res.json(user);
  } else {
    res.sendStatus(404).end();
  }
});

module.exports = router;
