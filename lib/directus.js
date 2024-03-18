import { createDirectus, rest } from "@directus/sdk";

const client = createDirectus("https://dbai.drumstock.dev").with(rest());

export default client;
