import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './config/database.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import sinhVienRoutes from './routes/sinhVien.routes.js';

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(loggerMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

app.use('/api/v1/sinh-vien', sinhVienRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy đường dẫn',
  });
});

app.use(errorMiddleware);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();

    await new Promise<void>((resolve, reject) => {
      const server = app.listen(port);
      server.once('listening', () => {
        console.log(`Server đang chạy tại http://localhost:${port}`);
        resolve();
      });
      server.once('error', reject);
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(
      `Không thể khởi động server (${errorName}). Kiểm tra SQL Server, cấu hình kết nối và cổng HTTP.`,
    );
    process.exitCode = 1;

    try {
      await sequelize.close();
    } catch (closeError) {
      const closeErrorName =
        closeError instanceof Error ? closeError.name : 'UnknownError';
      console.error(`Không thể đóng kết nối cơ sở dữ liệu (${closeErrorName}).`);
    }
  }
}

void start();
