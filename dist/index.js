"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3020;
// Lista de orígenes permitidos
const allowedOrigins = [
    "https://www.epatitas.com",
    "https://epatitas.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
];
// Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como apps móviles o Postman)
        if (!origin) {
            return callback(null, true);
        }
        // Verificar si el origen está permitido
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            // En desarrollo, permitir cualquier origen
            if (process.env.NODE_ENV !== "production") {
                callback(null, true);
            }
            else {
                // En producción, también permitir para evitar problemas de CORS
                callback(null, true);
            }
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 200, // Algunos navegadores legacy tienen problemas con 204
};
// Manejar preflight requests explícitamente para todas las rutas
app.options("*", (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
(0, db_1.default)();
app.get("/", (req, res) => {
    res.send("The server is running!");
});
app.use("/api", routes_1.default);
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map