export const env = Object.freeze({
	PORT: 8443,

	NODE_ENV: "development",

	DISCOVERY_CLIENT_ROUTE: "/discovery/client",
	A_JSON_ROUTE: "/api/json",
	SHA256_ROUTE: "/api/sha256",
	INVENTORY_ITEM_ROUTE: "/api/inventory-items",
	LOGIN_ROUTE: "/api/login",
	REGISTER_ROUTE: "/api/register",

	MONGO_URL: "mongodb://127.0.0.1:27017",
	DB_NAME: "inventory"
});