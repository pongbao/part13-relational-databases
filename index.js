const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./util/middleware");

const blogsRouter = require("./controllers/blogs");
const authorsRouter = require("./controllers/authors");
const usersRouter = require("./controllers/users");
const readingListsRouter = require("./controllers/reading_lists");
const adminRouter = require("./controllers/admin");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");

app.use(express.json());

app.use(requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/users", usersRouter);
app.use("/api/readinglists", readingListsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
