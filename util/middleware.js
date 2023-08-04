const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const UserSession = require("../models/user_session");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const userId = decodedToken.id;

      const session = await UserSession.findOne({
        where: {
          user_id: userId,
        },
      });

      const auth = authorization.substring(7);

      if (session.active && session.token === auth) {
        req.decodedToken = jwt.verify(auth, SECRET);
        next();
      } else {
        session.active = false;
        await session.save();
        res.status(401).json({ error: "token expired" });
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({ error: error.errors[0].message });
  } else if (error instanceof Error) {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
