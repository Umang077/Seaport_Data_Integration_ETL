# Seaport Data Integration ETL

## Overview

This project implements a **hybrid ETL pipeline** that synchronizes seaport data from a client's Azure Blob Storage into a PostgreSQL database.

The pipeline performs:

- Data extraction from Azure Blob Storage
- Data transformation (cleaning, validation, and deduplication)
- Data loading into PostgreSQL
- A GraphQL API to expose the processed data
- A simple React dashboard to view the results

The goal is to ensure that the seaport data remains synchronized with the client-provided dataset, which is exported twice daily.

---

## Architecture

```
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
```

---

## Tech Stack

### Backend
- Node.js
- Express
- GraphQL
- Prisma ORM

### Database
- PostgreSQL

### Frontend
- React

### Infrastructure
- Azure Blob Storage (Data Source)

These technologies align with the recommended stack defined in the assignment specification.

---

## Features

### Hybrid ETL Pipeline

The ETL process utilizes both of the following approaches:

#### Event-Driven Processing
The ETL runs automatically each time the server starts.

#### Batch Processing
The ETL runs every **12 hours/y hour** using a scheduled cron job. *(implemnted and updated the github)*

This combination ensures:

- Immediate data synchronization if the clients are randomly dumping/uploading the data in their excel at any particular time
- Reliability and consistency even if events are missed as the missed files will be extracted in batches

---

## Data Processing

The pipeline performs the following transformations:

### Validation
- Ensures all required fields are present
- Ensures latitude and longitude values are valid numbers

### Cleaning
- Removes unnecessary characters from field values
- Normalizes text casing for consistency

### Deduplication 
- Removes duplicate seaport entries before loading into the database 

### Schema Mapping

Fields stored in the database:

| Field | Description |
|---|---|
| `portName` | Name of the seaport |
| `locode` | UN/LOCODE identifier |
| `latitude` | Geographic latitude |
| `longitude` | Geographic longitude |
| `timezoneOlson` | Timezone in Olson format |
| `countryIso` | ISO country code |

These fields match the schema requirements defined in the assignment.

---

## Project Structure

```
backend/
├── etl/
│   └── syncSeaports.js
├── graphql/
│   ├── schema.js
├── prisma/
│   └── schema.prisma
├── validators/
│   └── seaportValidator.js
└── server.js

frontend/
└── (React dashboard)
```

---

## Installation

### Clone the Repository

```bash
git clone <repo-url>
cd project
```

### Install Dependencies

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

### Environment Variables

 `.env` file will be automaticaly created inside the `backend/` directory when you run the command 
 ```bash 
 npx prisma init
 ```
 **Note: After generating the .env file, update the DATABASE_URL port from the default 51213 to 51314 to prevent possible errors.**

Example:

```env
DATABASE_URL="prisma+postgres://localhost:51214/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ
```

---

## Database Setup (Prisma)

This project uses Prisma ORM to manage the PostgreSQL database.

### Step 1: Generate Prisma Client

Run:


The below code will generate the config files and to run in javascript change the .ts file to .js, also paste the code that i uploaded in prisma.config.js file and also install the npm modules required before trying to run other npx prisma command.

```bash
npx prisma init
```
The below command will run the prisma dev server by loading Prisma config from prisma.config.js

```bash
npx prisma dev 
```
**Run rest of the npx prisma command only after running the above code**

```bash
npx prisma generate
```

**Why this is required:**

Prisma reads the schema from `prisma/schema.prisma` and generates a Prisma Client, which is a type-safe database client used throughout the application.

Without running this command:

- Prisma queries will fail and produce the error that I faced in my video as well. 
- The application will be unable to communicate with the database

### Step 2: Run Database Migration

Run:

```bash
npx prisma migrate dev
```

**What this does:**

This command:

- Creates the necessary database tables
- Applies all schema migrations
- Updates the database structure to match the Prisma schema
- Regenerates the Prisma Client

Example table created:

**`Seaport`** with the following columns:

`id`, `portName`, `locode`, `latitude`, `longitude`, `timezoneOlson`, `countryIso`

### Step 3: Reset Database *(if required)*

Run:

```bash
npx prisma migrate reset
```

**What this command does:**

- Drops the existing database
- Recreates the database from scratch
- Reapplies all migrations in order
- Seeds the database if a seed script is configured

**When to use it:**

Use this command when:

- Schema changes have caused conflicts or broken the database
- Testing a completely fresh setup
- Resolving migration conflicts

This ensures the database structure is fully aligned with the current Prisma schema.

### Step 4: View Database

Run:

```bash
npx prisma studio
```
*(This only works with local postgresql on your system. For virtual database with Database_link in .env as given prisma+postgres the above command won't work)*

This opens a visual database browser where you can:

- Inspect all tables and their records
- Edit individual records directly
- Verify that the ETL results have been loaded correctly

---

## Running the Backend

Start the backend server:

1. Navigate to the backend folder:
```bash
   cd backend
```
2. Initialize Prisma and setup the database:
```bash
npx prisma dev
```
This step will:
Apply database migrations
Generate Prisma client
Ensure required tables exist

3. Start the backend server:
```bash
npm run dev
```

The server will be running at:

```
http://localhost:4000/graphql
```

---

## Running the Frontend

1. Navigate to the frontend folder:
```bash
   cd frontend
```
2. Start the React dashboard:

```bash
npm run dev
```

Open in your browser:

```
http://localhost:5173
```

---

## ETL Workflow

When the backend starts, the ETL pipeline will:

1. Connect to Azure Blob Storage
2. List all available files in the container
3. Download the relevant Excel file (for this I have considered the exact name of the file seaport_data_extract.xlsx)
4. For random file name pass ".xlsx" as the string in place of the mentioned xlsx file or you can replace it with the below code.
*(if (blob.name.endsWith(".xlsx")) {
        fileName = blob.name;})*
5. Parse the spreadsheet data into rows
6. Validate each row against the defined rules
7. Remove any duplicate entries
8. Insert the clean, validated data into PostgreSQL

---

## API Example

**GraphQL query:**

```graphql
query {
  seaports {
    portName
    locode
    latitude
    longitude
  }
}
```

**Example response:**

```json
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
```

---

## ETL Scheduling

The ETL pipeline is scheduled to run:

- **Once on server startup** — to ensure immediate synchronization *(implemented)*
- **Every 12 hours using cron** — *(implemented)*

This scheduling strategy ensures the system stays continuously synchronized with the client's data uploads.

---

## Scalability Considerations

Possible future improvements include:

- **Redis caching** for handling frequent and repeated queries more efficiently
- **Message queues** for more reliable and decoupled ETL processing
- **Horizontal scaling** using load balancers to distribute traffic across instances
- **Serverless ETL workers** for cost-effective, on-demand processing

---

## Edge Cases Considered

The pipeline has been designed to gracefully handle the following scenarios:

- Malformed data rows
- Missing or null coordinates
- Inconsistent port code formats
- Duplicate entries across imports
- Corrupted or unreadable Excel files

---

## How to Run the Entire Project

1. Clone the repository
2. Install all dependencies
3. Configure the `.env` file
4. Run `prisma generate`
5. Run `prisma migrate dev`
6. Start the backend server
7. Start the frontend application


# Extra Questions

## 1. What are some edge cases you would take care of before shipping this to production?

Before deploying this integration to production, I would account for several edge cases related to data quality, reliability, and system stability.

### Data Quality Issues
Since the platform is multi-tenant and different clients may provide inconsistent data, the ETL pipeline must handle malformed or incomplete records. Examples include:
- Missing required fields such as `portName`, `locode`, `latitude`, or `longitude`
- Invalid coordinate values (non-numeric or out-of-range latitude/longitude)
- Inconsistent `portCode` and `unLocCode` values
- Also to consider unique value during model creation which will be difficult to duplicate 

These are handled by the validation layer which ensures only valid records are inserted into the database.

### Duplicate Data
Because the client exports their data twice daily, duplicate records may appear. To prevent this, the pipeline performs deduplication before inserting records and uses database constraints or upsert operations to avoid duplicates.

### Corrupted or Unexpected File Formats
The uploaded Excel file may sometimes be corrupted or contain unexpected structures (multiple sheets, missing headers, etc.). In such cases the ETL process should fail gracefully and log the error without crashing the server.

### Large File Handling
If the dataset grows significantly, downloading the entire file into memory may become inefficient. In production this could be handled with streaming processing or chunk-based parsing.

### Network or Azure Connectivity Failures
Azure Blob access might temporarily fail. Retrying the download with exponential backoff or implementing a retry mechanism would improve reliability.

---

## 2. How would you scale this to handle high amounts of traffic?

Several architectural improvements could be introduced to support high traffic and larger datasets.

### API Layer Scaling
The GraphQL API could be horizontally scaled by running multiple instances behind a load balancer. This ensures the system can handle a larger number of concurrent requests.

### Caching
Frequently requested seaport data could be cached using a caching layer such as Redis. This would reduce database load and significantly improve response times for common queries and using react-query for frontend cahcing along with comparing if apollo performs better than react query or other caching technology.

### Database Optimization
Indexes could be added to frequently queried fields such as `locode` or `countryCode`. Query optimization and connection pooling would also improve database performance.

### ETL Processing
Instead of running the ETL process directly in the API server, it could be moved to a background worker or queue-based system (e.g., using message queues like Kafka or RabbitMQ). This would decouple data ingestion from API traffic.

### Data Pagination
GraphQL queries should implement pagination to prevent large responses from overloading the server or the client.


