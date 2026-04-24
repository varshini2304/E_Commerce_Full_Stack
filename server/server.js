import "dotenv/config";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = Number(process.env.PORT || 8080);

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    process.stdout.write(`Server running on port ${PORT}\n`);
  });
};

startServer().catch((error) => {
  process.stderr.write(`Failed to start server: ${error.message}\n`);
  process.exit(1);
});
