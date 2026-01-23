# API_Learning

A NestJS-based REST API for managing Deals and Memberships, built with TypeScript and PostgreSQL.

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - Object-Relational Mapping
- **Docker** - Containerization for database services
- **Keycloak** - Identity and Access Management
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

3. **Auth Module** (`src/app/modules/auth/`)
   - OAuth2 token endpoint for Keycloak integration
   - Authentication guard for protecting endpoints
   - Token validation service
   - Client credentials flow support

4. **Health Module** (`src/app/modules/health/`)
   - Health check endpoint for monitoring

5. **Database Module** (`src/app/modules/database/`)
   - Database configuration and migrations
   - Seed service for initial data

### API Endpoints

**Base URL:** `http://localhost:3005/training-plan`

#### Deals
- `GET /deals` - Get all deals (with optional filters: `client_id`, `status`)
- `GET /deals/:dealId` - Get a specific deal by ID
- `POST /deals/create` - Create a new deal
  - **Request Body:**
    ```json
    {
      "client_id": "string (alphanumeric, 1-64 characters)",
      "status": "DRAFT | ACTIVE | INACTIVE (optional, defaults to DRAFT)"
    }
    ```
  - **Response:** `201 Created` - Returns the created deal
- `PATCH /deals/update/:dealId` - Update a deal status by ID
  - **Path Parameter:** `dealId` (number)
  - **Request Body:**
    ```json
    {
      "status": "DRAFT | ACTIVE | INACTIVE"
    }
    ```
  - **Response:** `200 OK` - Returns the updated deal

#### Memberships
- `GET /memberships` - Get all memberships (with optional filter: `deal_id`)
- `GET /memberships/:id` - Get a specific membership by ID
- `POST /memberships/create/:dealID` - Create a new membership for a deal
  - **Path Parameter:** `dealID` (number)
  - **Request Body:**
    ```json
    {
      "name": "string (1-100 characters)",
      "email": "string (valid email address)"
    }
    ```
  - **Response:** `201 Created` - Returns the created membership
- `PATCH /memberships/update/:id` - Update a membership status by ID
  - **Path Parameter:** `id` (number)
  - **Request Body:**
    ```json
    {
      "status": "active | inactive | cancelled"
    }
    ```
  - **Response:** `200 OK` - Returns the updated membership

#### Authentication
- `POST /oauth2/token` - Get OAuth2 access token (Keycloak)
  - **Request Body:**
    ```json
    {
      "client_id": "string (1-255 characters, required)",
      "client_secret": "string (1-255 characters, required)",
      "realm": "string (1-255 characters, required)",
      "scope": "string (1-1000 characters, optional, defaults to 'all')"
    }
    ```
  - **Response:** `200 OK` - Returns access token, token type, and expiration
    ```json
    {
      "access_token": "string",
      "token_type": "Bearer",
      "expires_in": 3600
    }
    ```
  - **Error Responses:**
    - `400 Bad Request` - Invalid request parameters (e.g., missing realm)
    - `401 Unauthorized` - Invalid client credentials
    - `403 Forbidden` - Insufficient scope authorization
    - `429 Too Many Requests` - Rate limit exceeded

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
# Application Configuration
PORT=3005
NODE_ENV=development

# Main Database Configuration
DB_HOST=localhost
DB_PORT=5438
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb

# Keycloak Database
KEYCLOAK_DB_USERNAME=keycloak
KEYCLOAK_DB_PASSWORD=keycloak
KEYCLOAK_DB_NAME=keycloak
KEYCLOAK_DB_PORT=5439

# Keycloak Admin
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_PORT=8088
KEYCLOAK_TIMEOUT=5000

# Optional: Set to 'true' to use migrations instead of synchronize
USE_MIGRATIONS=false
```

### Step 3: Start Services with Docker Compose

Start PostgreSQL and Keycloak services using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** (main database) on port `5438`:
  - Username: `myuser`
  - Password: `mypassword`
  - Database: `mydb`
- **Keycloak Database** on port `5439`:
  - Username: `keycloak`
  - Password: `keycloak`
  - Database: `keycloak`
- **Keycloak** on port `8084`:
  - Admin Console: `http://localhost:8084`
  - Admin Username: `admin`
  - Admin Password: `admin`

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

2. Test OAuth2 token endpoint (requires Keycloak client setup):
   ```bash
   curl -X POST http://localhost:3005/training-plan/oauth2/token \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": "your-client-id",
       "client_secret": "your-client-secret",
       "realm": "your-realm",
       "scope": "all"
     }'
   ```

3. Test deals endpoint:
   ```bash
   curl http://localhost:3005/training-plan/deals
   ```

4. Test memberships endpoint:
   ```bash
   curl http://localhost:3005/training-plan/memberships
   ```

### Step 8: Set Up Keycloak (Optional)

To use the authentication endpoints, you'll need to configure Keycloak:

1. Access Keycloak Admin Console at `http://localhost:8084`
2. Log in with admin credentials (default: `admin`/`admin`)
3. Create a realm (or use an existing one)
4. Create a client with:
   - Client ID: Your client identifier
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Service Accounts Enabled: `ON` (for client credentials flow)
5. Note the client secret from the Credentials tab
6. Use these values when calling the `/oauth2/token` endpoint

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
│   │   ├── auth/            # Authentication module
│   │   │   ├── guards/      # Auth guard for protecting endpoints
│   │   │   └── models/      # Auth request/response models
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

## Authentication

The API includes OAuth2 authentication via Keycloak. The authentication module provides:

- **Token Endpoint**: `POST /oauth2/token` - Issues access tokens using client credentials flow
- **Auth Guard**: `AuthGuard` - Protects endpoints by validating Bearer tokens
- **Token Validation**: Validates JWT tokens and checks expiration

### Using Authentication

To protect an endpoint, use the `@UseGuards(AuthGuard)` decorator:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(AuthGuard)
  getProtectedData() {
    return { message: 'This endpoint requires authentication' };
  }
}
```

### Making Authenticated Requests

Include the access token in the Authorization header:

```bash
curl -H "Authorization: Bearer <your-access-token>" \
  http://localhost:3005/training-plan/protected
```

## Next Steps

- [ ] Demo to P&V
