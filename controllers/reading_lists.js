const router = require("express").Router();
const UserBlogs = require("../models/user_blogs");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const blog = await UserBlogs.create({ ...req.body, read: false });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const blogInReadingList = await UserBlogs.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.json(blogInReadingList);
  } catch (error) {
    next(error);
  }
});

router.post("/:id", tokenExtractor, async (req, res, next) => {
  const returnedBlog = await UserBlogs.findOne({
    where: {
      id: req.params.id,
    },
  });

  try {
    if (returnedBlog) {
      if (Number(req.params.id) === req.decodedToken.id) {
        const result = await UserBlogs.update(
          { read: req.body.read },
          { where: { id: req.params.id } }
        );

        const rowsAffected = result[0];

        if (rowsAffected > 0) {
          const updatedBlog = await UserBlogs.findOne({
            where: {
              id: req.params.id,
            },
          });
          res.json(updatedBlog);
        } else {
          res.status(500).json({ error: "reading list update failed" });
        }
      } else {
        res.status(401).json({ error: "unauthorized" });
      }
    } else {
      res.status(404).json({ error: "blog not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
