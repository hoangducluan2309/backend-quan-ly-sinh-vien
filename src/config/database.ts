import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Đọc biến môi trường bắt buộc và báo tên biến nếu chưa được cấu hình.
function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${name}`);
  }

  return value;
}

// Chỉ chấp nhận số nguyên thập phân trong phạm vi cổng TCP hợp lệ.
function readPort(): number {
  const value = requiredEnv('DB_PORT');
  if (!/^\d+$/.test(value)) {
    throw new Error('Biến DB_PORT phải là số nguyên từ 1 đến 65535');
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Biến DB_PORT phải là số nguyên từ 1 đến 65535');
  }

  return port;
}

// Parse boolean tường minh để chuỗi "false" không bị hiểu nhầm thành true.
function readBoolean(name: string): boolean {
  const value = requiredEnv(name).toLowerCase();
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  throw new Error(`Biến môi trường ${name} chỉ được nhận true hoặc false`);
}

const database = requiredEnv('DB_NAME');
const username = requiredEnv('DB_USER');
const password = requiredEnv('DB_PASSWORD');
const host = requiredEnv('DB_HOST');
const port = readPort();
const encrypt = readBoolean('DB_ENCRYPT');
const trustServerCertificate = readBoolean('DB_TRUST_CERT');

// Instance Sequelize dùng chung; kết nối chỉ mở khi gọi authenticate().
export const sequelize = new Sequelize(database, username, password, {
  dialect: 'mssql',
  host,
  port,
  logging: console.log,
  dialectOptions: {
    options: {
      encrypt,
      trustServerCertificate,
    },
  },
});
