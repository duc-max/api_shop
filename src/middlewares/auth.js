import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "SecretKEY", (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const generateAccessToken = (username) => {
  return jwt.sign({ data: username }, "SecretKEY", {
    expiresIn: "1h",
  });
};

export { authenticateToken, generateAccessToken };
