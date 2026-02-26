import dotenv from "dotenv";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => {
    process.stdout.write(`Server listening on port ${port}\n`);
  });
};

startServer().catch((error) => {
  process.stderr.write(`Failed to start server: ${error.message}\n`);
  process.exit(1);
});
