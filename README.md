# Seaport Data Integration ETL

## Overview

This project implements a **hybrid ETL pipeline** that synchronizes seaport data from a client's Azure Blob Storage into a PostgreSQL database.

The pipeline performs:

- Data extraction from Azure Blob Storage
- Data transformation (cleaning, validation, deduplication)
- Data loading into PostgreSQL
- GraphQL API to expose the processed data
- A simple React dashboard to view the results

The goal is to ensure that the seaport data remains synchronized with the client-provided dataset, which is exported twice daily.

---

# Architecture


Azure Blob Storage
↓
Hybrid ETL (Event Driven + Batch)
↓
Data Cleaning & Validation
↓
PostgreSQL Database
↓
Prisma ORM
↓
GraphQL API
↓
React Dashboard


---

# Tech Stack

## Backend
- Node.js
- Express
- GraphQL
- Prisma ORM

## Database
- PostgreSQL

## Frontend
- React

## Infrastructure
- Azure Blob Storage (Data Source)

These technologies align with the recommended stack in the assignment specification.

---

# Features

## Hybrid ETL Pipeline

The ETL process uses both:

### Event-driven processing
ETL runs automatically when the server starts.

### Batch processing
ETL runs every **12 hours** using a scheduled cron job.

This ensures:

- Immediate synchronization
- Reliability even if events are missed

---

# Data Processing

The pipeline performs the following transformations:

### Validation
- Ensures required fields exist
- Ensures latitude and longitude are valid numbers

### Cleaning
- Removes unnecessary characters
- Normalizes casing

### Deduplication
- Removes duplicate seaport entries

### Schema Mapping

Fields stored in the database:

| Field | Description |
|------|-------------|
| portName | Name of the seaport |
| locode | UN/LOCODE |
| latitude | Geographic latitude |
| longitude | Geographic longitude |
| timezoneOlson | Timezone |
| countryIso | ISO country code |

These match the schema requirements defined in the assignment.

---

# Project Structure


backend
├ etl
│ └ syncSeaports.js
│
├ graphql
│ ├ schema.js
│ └ resolvers.js
│
├ prisma
│ └ schema.prisma
│
├ validators
│ └ seaportValidator.js
│
└ server.js

frontend
└ React dashboard


---

# Installation

Clone the repository:

```bash
git clone <repo-url>
cd project

Install backend dependencies:

cd backend
npm install

Install frontend dependencies:

cd ../frontend
npm install
Environment Variables

Create a .env file inside the backend directory.

Example:

DATABASE_URL="postgresql://postgres:password@localhost:5432/seaportdb"
PORT=4000
Database Setup (Prisma)

This project uses Prisma ORM to manage the PostgreSQL database.

Step 1 — Generate Prisma Client

Run:

npx prisma generate
Why this is required

Prisma reads the schema from:

prisma/schema.prisma

and generates a Prisma Client, which is a type-safe database client used in the application.

Without running this command:

Prisma queries will fail

The application cannot communicate with the database

Step 2 — Run Database Migration

Run:

npx prisma migrate dev
What this does

This command:

Creates database tables

Applies schema migrations

Updates the database structure

Regenerates Prisma Client

Example table created:

Seaport

with columns:

id
portName
locode
latitude
longitude
timezoneOlson
countryIso
Step 3 — Reset Database (if required)

If you need to clear the database and reapply migrations, run:

npx prisma migrate reset
What this command does

Drops the existing database

Recreates the database

Reapplies all migrations

Seeds the database if configured

When to use it

Use this command when:

schema changes break the database

testing a fresh setup

fixing migration conflicts

This ensures the database structure matches the Prisma schema.

Step 4 — View Database

Run:

npx prisma studio

This opens a visual database browser.

You can:

Inspect tables

Edit records

Verify ETL results

Running the Backend

Start the backend server:

npm run dev

Server runs at:

http://localhost:4000/graphql
Running the Frontend

Start the React dashboard:

npm run dev

Open:

http://localhost:5173
ETL Workflow

When the backend starts:

Connects to Azure Blob Storage

Lists available files

Downloads the Excel file

Parses spreadsheet data

Validates rows

Removes duplicates

Inserts clean data into PostgreSQL

API Example

GraphQL query:

query {
  seaports {
    portName
    locode
    latitude
    longitude
  }
}

Example response:

{
  "data": {
    "seaports": [
      {
        "portName": "ROTTERDAM",
        "locode": "NLRTM"
      }
    ]
  }
}
ETL Scheduling

The ETL pipeline runs:

Once on server startup

Every 12 hours using cron (YET TO BE IMPLEMENTED)

This ensures that the system stays synchronized with client data uploads.

Scalability Considerations

Possible improvements:

Redis caching for frequent queries

Message queue for ETL processing

Horizontal scaling using load balancers

Serverless ETL workers

Edge Cases Considered

Malformed data rows

Missing coordinates

Inconsistent port codes

Duplicate entries

Corrupted Excel files

How to Run the Entire Project
1. Clone repository
2. Install dependencies
3. Configure .env
4. Run prisma generate
5. Run prisma migrate dev
6. Start backend
7. Start frontend
