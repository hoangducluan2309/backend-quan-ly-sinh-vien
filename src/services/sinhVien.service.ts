import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from 'sequelize';
import type { ISinhVienDTO } from '../dtos/sinhVien.dto.js';
import { Lop, SinhVien } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

function toDTO(sinhVien: SinhVien): ISinhVienDTO {
  return {
    maSV: sinhVien.maSV,
    hoTen: sinhVien.hoTen,
    email: sinhVien.email,
    maLop: sinhVien.maLop,
  };
}

export async function layDanhSachSinhVien(): Promise<ISinhVienDTO[]> {
  const sinhVienList = await SinhVien.findAll({
    order: [['maSV', 'ASC']],
  });

  return sinhVienList.map(toDTO);
}

export async function timSinhVienTheoMa(
  maSV: string,
): Promise<ISinhVienDTO | undefined> {
  const sinhVien = await SinhVien.findByPk(maSV);
  return sinhVien ? toDTO(sinhVien) : undefined;
}

function normalizeText(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new AppError(400, `${fieldName} phải là chuỗi`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new AppError(400, `${fieldName} không được để trống`);
  }

  return normalized;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isMaLopForeignKeyError(
  error: unknown,
): error is ForeignKeyConstraintError {
  return (
    error instanceof ForeignKeyConstraintError &&
    (error.index === 'FK_SinhVien_Lop_maLop' ||
      Object.prototype.hasOwnProperty.call(error.fields ?? {}, 'maLop'))
  );
}

export async function themSinhVien(input: unknown): Promise<ISinhVienDTO> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new AppError(400, 'Dữ liệu sinh viên phải là object');
  }

  const data = input as Record<string, unknown>;
  const maSV = normalizeText(data.maSV, 'Mã sinh viên');
  const hoTen = normalizeText(data.hoTen, 'Họ tên');
  const email = normalizeText(data.email, 'Email');
  const maLop = normalizeText(data.maLop, 'Mã lớp');

  if (!/^SV[0-9]{3}$/.test(maSV)) {
    throw new AppError(400, 'Mã sinh viên không hợp lệ. Ví dụ: SV003');
  }

  if (hoTen.length > 150) {
    throw new AppError(400, 'Họ tên không được vượt quá 150 ký tự');
  }

  if (email.length > 254) {
    throw new AppError(400, 'Email không được vượt quá 254 ký tự');
  }

  if (maLop.length > 50) {
    throw new AppError(400, 'Mã lớp không được vượt quá 50 ký tự');
  }

  if (!isValidEmail(email)) {
    throw new AppError(400, 'Email không hợp lệ');
  }

  if (!(await Lop.findByPk(maLop))) {
    throw new AppError(400, 'Mã lớp không tồn tại');
  }

  if (await SinhVien.findByPk(maSV)) {
    throw new AppError(409, 'Mã sinh viên đã tồn tại');
  }

  try {
    const sinhVienMoi = await SinhVien.create({
      maSV,
      hoTen,
      email,
      maLop,
    });

    return toDTO(sinhVienMoi);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(409, 'Mã sinh viên đã tồn tại');
    }

    if (isMaLopForeignKeyError(error)) {
      throw new AppError(400, 'Mã lớp không tồn tại');
    }

    throw error;
  }
}
