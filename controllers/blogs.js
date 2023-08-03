const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "DESC"]],
    where: {
      [Op.or]: {
        title: { [Op.iLike]: req.query.search ? `%${req.query.search}%` : "%" },
        author: {
          [Op.iLike]: req.query.search ? `%${req.query.search}%` : "%",
        },
      },
    },
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      createdAt: new Date(),
      updatedat: new Date(),
    });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      console.log(req.blog.toJSON());
      res.json(req.blog);
    } else {
      throw new Error("blog not found");
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      req.blog.likes += 1;
      await req.blog.save();
      res.json(req.blog);
    } else {
      throw new Error("blog not found");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.decodedToken) {
      if (req.blog) {
        if (req.blog.userId === req.decodedToken.id) {
          await Blog.destroy({ where: { id: req.params.id } });
          res.status(204);
        } else {
          return res.status(401).json({ error: "unauthorized" });
        }
      } else {
        throw new Error("blog not found");
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
