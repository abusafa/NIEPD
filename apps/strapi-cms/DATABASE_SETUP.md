# PostgreSQL Database Setup for NIEPD Strapi CMS

## Database Configuration

The Strapi CMS has been configured to use PostgreSQL with the following settings:

- **Database Name**: `niepd`
- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `postgres`

## Environment Variables

Create a `.env` file in the `apps/strapi-cms/` directory with the following content:

```bash
# Server
HOST=0.0.0.0
PORT=1337

# Secrets - IMPORTANT: Change these values in production!
APP_KEYS="your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4"
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=niepd
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

## Prerequisites

1. **PostgreSQL Server**: Make sure PostgreSQL is installed and running on your system
2. **Database Creation**: Create the `niepd` database:
   ```sql
   CREATE DATABASE niepd;
   ```

## Quick Setup Commands

```bash
# Navigate to the Strapi CMS directory
cd apps/strapi-cms

# Install dependencies (already done)
npm install

# Create your .env file with the variables above
# Then start the development server
npm run develop
```

## What Changed

1. **Dependencies**: Replaced `better-sqlite3` with `pg` (PostgreSQL driver)
2. **Database Config**: Updated `config/database.ts` to use PostgreSQL as default
3. **Default Values**: Set default database connection values to match your requirements

## Troubleshooting

- Ensure PostgreSQL service is running
- Verify the database `niepd` exists
- Check that the username/password combination is correct
- Make sure the PostgreSQL server is accepting connections on localhost:5432
