import { sequelize } from '../config/database.js';

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('DB connected: QuanLySinhVienDB');
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`Database connection failed (${errorName}). Check SQL Server status, TCP host/port, login permissions, and encryption settings.`);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void main();
