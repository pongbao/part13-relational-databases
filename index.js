require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

console.log(process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

Blog.sync();

app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(400).end();
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await Blog.destroy({ where: { id: req.params.id } });
    res.status(204);
  } else {
    res.status(400).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
