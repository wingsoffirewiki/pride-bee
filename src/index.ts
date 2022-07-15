/** @format */

import { Client, ClientOptions } from "fero-dc";

import { config } from "dotenv";

config();

import options from "./config/config.json";

const client = new Client(options as ClientOptions, __dirname);

const token = process.env.TOKEN;

if (token === undefined) {
  throw new Error("Token is not defined");
}

client.start(token);
