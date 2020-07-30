export const env = Object.freeze({
	PORT: 80,

	NODE_ENV: "development",

	DISCOVERY_CLIENT_ROUTE: "/discovery/client",
	A_JSON_ROUTE: "/api/json",
	SHA256_ROUTE: "/api/sha256",

	MONGO_URL: "mongodb://127.0.0.1:27017",
	DB_NAME: "a-json-db"
});