const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

// Ensure the connection string exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// In Prisma 7, passing the adapter is correct, but the error suggests 
// the generated files aren't being picked up. 
// We pass an empty config object alongside the adapter to satisfy the constructor.
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
