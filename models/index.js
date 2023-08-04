const Blog = require("./blog");
const User = require("./user");
const UserBlogs = require("./user_blogs");
const UserSession = require("./user_session");

User.hasMany(Blog);
Blog.belongsTo(User);
UserSession.belongsTo(User);

User.belongsToMany(Blog, { through: UserBlogs, as: "readings" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_marked" });

module.exports = {
  Blog,
  User,
};
