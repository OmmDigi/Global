import app from "./app";

const PORT = parseInt(process.env.PORT || "8081");

// Start server
app.listen(PORT, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:" + PORT);
});
