const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
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

router.delete("/:id", blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      await Blog.destroy({ where: { id: req.params.id } });
      res.status(204);
    } else {
      throw new Error("blog not found");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
