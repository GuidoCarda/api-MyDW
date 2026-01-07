import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import router from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3020;

// Configuración de CORS
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      "https://www.epatitas.com",
      "https://epatitas.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ];

    // Permitir peticiones sin origen (como apps móviles o Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origen está permitido
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En desarrollo, permitir cualquier origen
      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    }
  },
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("The server is running!");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
