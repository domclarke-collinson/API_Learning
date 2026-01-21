import dataSource from '../src/app/modules/database/data-source';

async function revertLastMigration() {
  try {
    console.log('Initializing data source...');
    await dataSource.initialize();

    console.log('Reverting last migration...');
    await dataSource.undoLastMigration();

    console.log('Migration reverted successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Migration revert failed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

revertLastMigration();
