const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/**
 * Reads a required environment variable, failing fast with a helpful message.
 * @param {string} name
 * @returns {string}
 */
function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`\n[config] Falta la variable de entorno "${name}".`);
    console.error('[config] Copia "server/.env.example" a "server/.env" y completa tus valores.\n');
    process.exit(1);
  }
  return value.trim();
}

/**
 * Centralized, validated application configuration.
 */
const config = {
  port: Number(process.env.PORT) || 3000,
  serpApiKey: required("SERP_API_KEY"),
  defaults: {
    hl: process.env.SERP_HL || "es", // results/interface language
    gl: process.env.SERP_GL || "co", // country
    pageSize: 10, // results per page (matches Google's `start` increments)
  },
  cache: {
    ttlMs: 5 * 60 * 1000, // 5 minutes
    maxEntries: 200,
  },
};

module.exports = config;
