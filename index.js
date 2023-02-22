

const metrics_auth_refresh_fn = async (req, res) => {

  // health check
  if (req.params["health"] === "health") {
    res.write(JSON.stringify({success: true, msg: "Health check success"}))
    res.end()
  }

  // Add your code here
  res.write(JSON.stringify({success: true, msg: `Hello metrics_auth_refresh_fn`}))
  res.end()
  
}

export default metrics_auth_refresh_fn
