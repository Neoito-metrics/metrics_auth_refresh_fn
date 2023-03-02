import { shared } from "@appblocks/node-sdk";

const metrics_auth_refresh_fn = async (req, res) => {
  // health check
  if (req.params["health"] === "health") {
    res.write(JSON.stringify({ success: true, msg: "Health check success" }));
    res.end();
  }

  try {
    const { getSequelizeInstance, auth } = await shared.getShared();
    const { models } = await getSequelizeInstance();
    const bodyBuffer = [];
    for await (const chunk of req) {
      bodyBuffer.push(chunk);
    }
    const data = Buffer.concat(bodyBuffer).toString();
    req.body = JSON.parse(data || "{}");

    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const payload = auth.verifyToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const user = await models.User.findOne({ where: { id: payload.user_id } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const newToken = auth.signToken(user.id);
    res.cookie("refreshToken", newToken.refreshToken, { httpOnly: true });
    res
      .status(200)
      .json({ token: newToken.token, refreshToken: newToken.refreshToken });
    res.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default metrics_auth_refresh_fn;
