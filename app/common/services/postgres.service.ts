import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: `${process.env.POSTGRES_USER}`,
  host: `${process.env.POSTGRES_HOST}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  port: Number(process.env.POSTGRES_PORT || 5432)
});

export default pool