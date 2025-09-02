import app from "./app";

const PORT = parseInt(process.env.PORT || "8081");
const HOST = process.env.HOST ?? "127.0.0.1";

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`);
});
