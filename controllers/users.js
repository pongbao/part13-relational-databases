const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create({
      ...req.body,
      createdAt: new Date(),
      updatedat: new Date(),
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "user not found" });
  }
});

router.put("/:username", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ where: { username: body.username } });
  if (user) {
    const result = await User.update(
      {
        username: body.newUsername,
      },
      { where: { username: body.username } }
    );

    const rowsAffected = result[0];

    if (rowsAffected > 0) {
      const updatedUser = await User.findOne({
        where: { username: body.newUsername },
      });
      res.json(updatedUser);
    } else {
      res.status(500).json({ error: "user update failed" });
    }
    console.log(result);
  } else {
    res.status(404).json({ error: "user not found" });
  }
});

module.exports = router;
