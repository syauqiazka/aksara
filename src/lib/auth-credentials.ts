import fs from "node:fs";
import path from "node:path";

interface AdminCredentials {
  email: string;
  password: string;
}

// Global cache for runtime persistence in dev and serverless instances
const globalForAuth = globalThis as unknown as {
  __adminCredentials?: AdminCredentials;
};

const CREDENTIALS_FILE = path.join(process.cwd(), "data", "admin-credentials.json");

export function getAdminCredentials(): AdminCredentials {
  if (globalForAuth.__adminCredentials) {
    return globalForAuth.__adminCredentials;
  }

  // 1. Check file storage if exists
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const content = fs.readFileSync(CREDENTIALS_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (parsed.email && parsed.password) {
        globalForAuth.__adminCredentials = {
          email: parsed.email.trim().toLowerCase(),
          password: parsed.password,
        };
        return globalForAuth.__adminCredentials;
      }
    }
  } catch (err) {
    console.error("[auth-credentials] Error reading credentials file:", err);
  }

  // 2. Fallback to process.env
  const email = (process.env.ADMIN_DEFAULT_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_DEFAULT_PASSWORD || "";

  globalForAuth.__adminCredentials = { email, password };
  return globalForAuth.__adminCredentials;
}

export async function updateAdminCredentials(
  newEmail: string,
  newPassword?: string
): Promise<AdminCredentials> {
  const current = getAdminCredentials();
  const updatedEmail = newEmail.trim().toLowerCase();
  const updatedPassword = newPassword && newPassword.trim() ? newPassword : current.password;

  // 1. Update in-memory cache and process.env
  globalForAuth.__adminCredentials = {
    email: updatedEmail,
    password: updatedPassword,
  };
  process.env.ADMIN_DEFAULT_EMAIL = updatedEmail;
  process.env.ADMIN_DEFAULT_PASSWORD = updatedPassword;

  // 2. Save to data/admin-credentials.json
  try {
    const dir = path.dirname(CREDENTIALS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      CREDENTIALS_FILE,
      JSON.stringify(globalForAuth.__adminCredentials, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("[auth-credentials] Error writing credentials file:", err);
  }

  // 3. Update .env.local on disk if present
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");
      if (/^ADMIN_DEFAULT_EMAIL=.*$/m.test(envContent)) {
        envContent = envContent.replace(
          /^ADMIN_DEFAULT_EMAIL=.*$/m,
          `ADMIN_DEFAULT_EMAIL=${updatedEmail}`
        );
      } else {
        envContent += `\nADMIN_DEFAULT_EMAIL=${updatedEmail}`;
      }

      if (/^ADMIN_DEFAULT_PASSWORD=.*$/m.test(envContent)) {
        envContent = envContent.replace(
          /^ADMIN_DEFAULT_PASSWORD=.*$/m,
          `ADMIN_DEFAULT_PASSWORD=${updatedPassword}`
        );
      } else {
        envContent += `\nADMIN_DEFAULT_PASSWORD=${updatedPassword}`;
      }

      fs.writeFileSync(envPath, envContent, "utf8");
    }
  } catch (err) {
    console.error("[auth-credentials] Error writing .env.local:", err);
  }

  return globalForAuth.__adminCredentials;
}

