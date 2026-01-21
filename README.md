# API_Learning

A NestJS-based REST API for managing Deals and Memberships, built with TypeScript and PostgreSQL.

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - Object-Relational Mapping
- **Docker** - Containerization for database services
- **Jest** - Testing framework
- **ESLint & Prettier** - Code quality and formatting

## What's Been Created

### Modules

1. **Deals Module** (`src/deals/`)
   - Deal entity and service
   - Deal controller with REST endpoints
   - Deal status management (DRAFT, ACTIVE, INACTIVE)
   - Response models and DTOs

2. **Memberships Module** (`src/membership/`)
   - Membership entity and service
   - Membership controller with REST endpoints
   - Membership status management (active, inactive, cancelled)
   - Create membership models

3. **Health Module** (`src/app/modules/health/`)
   - Health check endpoint for monitoring

4. **Database Module** (`src/app/modules/database/`)
   - Database configuration and migrations
   - Seed service for initial data

### API Endpoints

**Base URL:** `http://localhost:3005/training-plan`

#### Deals
- `GET /deals` - Get all deals (with optional filters: `client_id`, `status`)
- `GET /deals/:dealId` - Get a specific deal by ID

#### Memberships
- `GET /memberships` - Get all memberships (with optional filter: `deal_id`)
- `GET /memberships/:id` - Get a specific membership by ID

#### Health
- `GET /health` - Health check endpoint

## Database Schema

### Enums

**deal_status:**
- `DRAFT` - Deal is in draft state
- `ACTIVE` - Deal is active
- `INACTIVE` - Deal is inactive

**membership_status:**
- `active` - Membership is active
- `inactive` - Membership is inactive
- `cancelled` - Membership is cancelled

### Tables

#### `deals`
| Column      | Type                    | Constraints                    |
|-------------|-------------------------|--------------------------------|
| deal_id     | SERIAL                  | PRIMARY KEY                    |
| client_id   | INTEGER                 | NOT NULL, CHECK (client_id > 0) |
| status      | deal_status             | NOT NULL, DEFAULT 'DRAFT'      |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                  |

**Indexes:**
- `idx_deals_client_id` on `client_id`
- `idx_deals_status` on `status`

#### `memberships`
| Column      | Type                    | Constraints                    |
|-------------|-------------------------|--------------------------------|
| id          | SERIAL                  | PRIMARY KEY                    |
| name        | VARCHAR(100)            | NOT NULL, CHECK (LENGTH(name) > 0) |
| email       | VARCHAR(255)            | UNIQUE, NOT NULL, Email validation |
| deal_id     | INTEGER                 | NOT NULL, FK to deals.deal_id, ON DELETE CASCADE |
| status      | membership_status        | NOT NULL, DEFAULT 'active'     |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                  |

**Indexes:**
- `idx_memberships_deal_id` on `deal_id`
- `idx_memberships_status` on `status`

### Relationships
- **Memberships → Deals**: Many-to-One relationship
  - Each membership belongs to one deal
  - Deleting a deal cascades to delete associated memberships

## Local Development Setup

### Prerequisites

- **Node.js** >= 24.0.0
- **Docker** and **Docker Compose** (for PostgreSQL database)
- **npm** or **yarn**

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd API_Learning

# Install dependencies
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit the `.env` file and configure the following variables:

```bash
# Optional: Set to 'true' to use migrations instead of synchronize
USE_MIGRATIONS=false
```

### Step 3: Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d postgres
```

This will start a PostgreSQL 15 container on port `5438` with:
- Username: `myuser`
- Password: `mypassword`
- Database: `mydb`

### Step 4: Run Database Migrations

Run the initial schema migration:

```bash
npm run migration:run
```

This will create the `deals` and `memberships` tables along with the necessary enums and indexes.

### Step 5: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

### Step 6: Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3005/training-plan`

### Step 7: Verify Setup

1. Check health endpoint:
   ```bash
   curl http://localhost:3005/training-plan/health
   ```

2. Test deals endpoint:
   ```bash
   curl http://localhost:3005/training-plan/deals
   ```

3. Test memberships endpoint:
   ```bash
   curl http://localhost:3005/training-plan/memberships
   ```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run migration:show` - Show migration status
- `npm run seed` - Seed the database with sample data
- `npm run format:check` - Check code formatting
- `npm run format:fix` - Fix code formatting

## Database Management

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Creating New Migrations

```bash
# Generate a new migration (auto-generate from entity changes)
npm run migration:generate src/app/modules/database/migrations/MigrationName

# Create an empty migration file
npm run migration:create src/app/modules/database/migrations/MigrationName
```

## Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Fix code formatting
npm run format:fix

# Type check TypeScript
npm run type-check
```

## Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── database/        # Database configuration and migrations
│   │   └── health/          # Health check module
│   └── config/              # Configuration service
├── deals/                   # Deals module
│   ├── models/              # Deal response models
│   └── *.entity.ts          # Deal entity
├── membership/              # Memberships module
│   ├── models/              # Membership models
│   └── *.entity.ts          # Membership entity
└── main.ts                  # Application entry point

scripts/
├── migration.ts             # Migration runner script
├── migration-revert.ts      # Migration revert script
└── seed.ts                  # Database seeding script
```

## Next Steps

- [ ] Create Gateway
- [ ] Add authentication/authorization
- [ ] Expand API endpoints (POST, PUT, DELETE)
- [ ] Add comprehensive test coverage