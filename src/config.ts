import { config } from "dotenv";

config();
export const TOKEN = process.env.TOKEN;
export const CHANNEL = process.env.CHANNEL;
export const DB_URL = process.env.DB_URL;
export const STARTING_NUMBER = process.env.STARTING_NUMBER

