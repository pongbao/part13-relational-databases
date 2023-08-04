const router = require("express").Router();

const User = require("../models/user");
const UserSessions = require("../models/user_session");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    console.log(req.decodedToken.id);
    const user = await User.findByPk(req.decodedToken.id);
    const session = await UserSessions.findOne({
      where: {
        user_id: user.id,
      },
    });
    session.active = false;
    session.save();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
