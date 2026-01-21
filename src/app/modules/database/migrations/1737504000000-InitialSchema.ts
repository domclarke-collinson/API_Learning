import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1737504000000 implements MigrationInterface {
  name = 'InitialSchema1737504000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create deal_status enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE deal_status AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create membership_status enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE membership_status AS ENUM ('active', 'inactive', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create deals table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS deals (
        deal_id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL CHECK (client_id > 0),
        status deal_status NOT NULL DEFAULT 'DRAFT',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create memberships table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL CHECK (LENGTH(name) > 0),
        email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
        deal_id INTEGER NOT NULL
          REFERENCES deals(deal_id)
          ON DELETE CASCADE
          CHECK (deal_id > 0),
        status membership_status NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_memberships_deal_id ON memberships(deal_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_deals_client_id ON deals(client_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_memberships_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_deals_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_deals_client_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_memberships_deal_id;`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS memberships;`);
    await queryRunner.query(`DROP TABLE IF EXISTS deals;`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS membership_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS deal_status;`);
  }
}