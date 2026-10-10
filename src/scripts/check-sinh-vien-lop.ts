import { Lop, SinhVien } from '../models/index.js';
import { sequelize } from '../config/database.js';

function redactSecrets(message: string): string {
  const password = process.env.DB_PASSWORD;
  const username = process.env.DB_USER;

  let redacted = message;
  if (password) {
    redacted = redacted.replaceAll(password, '[REDACTED]');
  }
  if (username) {
    redacted = redacted.replaceAll(username, '[REDACTED]');
  }

  return redacted;
}

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();

    const sinhViens = await SinhVien.findAll({
      attributes: ['maSV', 'hoTen', 'email', 'maLop'],
      include: [
        {
          model: Lop,
          as: 'lop',
          attributes: ['maLop', 'tenLop'],
          required: true,
        },
      ],
      order: [['maSV', 'ASC']],
    });

    console.log(
      JSON.stringify(
        sinhViens.map((sinhVien) => sinhVien.get({ plain: true })),
        null,
        2,
      ),
    );
  } catch (error) {
    const seen = new Set<unknown>();
    let current: unknown = error;

    while (current instanceof Error && !seen.has(current)) {
      seen.add(current);
      const details = current as Error & {
        code?: unknown;
        number?: unknown;
        original?: unknown;
        parent?: unknown;
        cause?: unknown;
      };
      const code = details.code ?? details.number;
      const suffix =
        code === undefined ? '' : ` [${String(code)}]`;
      console.error(
        `${current.name}${suffix}: ${redactSecrets(current.message)}`,
      );
      current = details.original ?? details.parent ?? details.cause;
    }

    if (!(error instanceof Error)) {
      console.error('Không thể kiểm tra quan hệ sinh viên-lớp (UnknownError).');
    }
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void main();
