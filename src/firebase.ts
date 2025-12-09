import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Validar que las variables de entorno requeridas estén presentes
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName] || process.env[varName] === ""
);

if (missingVars.length > 0) {
  console.error(
    "\n❌ Error: Faltan las siguientes variables de entorno de Firebase:"
  );
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\n📝 Por favor, crea un archivo .env en la raíz del proyecto con las credenciales de Firebase Admin."
  );
  console.error("   Puedes usar .env.example como referencia.\n");
  process.exit(1);
}

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  console.log("✅ Firebase Admin inicializado correctamente");
} catch (error) {
  console.error("❌ Error al inicializar Firebase Admin:", error);
  process.exit(1);
}

export default admin;
