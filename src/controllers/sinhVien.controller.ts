// Controller: nơi nhận request và trả về response HTTP.
// Ở đây, Controller chỉ gọi Service để lấy danh sách sinh viên
// rồi định nghĩa JSON trả về cho client.

import type { NextFunction, Request, Response } from 'express';
import {
  layDanhSachSinhVien,
  themSinhVien,
  timSinhVienTheoMa,
} from '../services/sinhVien.service.js';

export const getDanhSachSinhVien = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await layDanhSachSinhVien();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSinhVienTheoMa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const maSVParam = req.params.maSV;
    const maSV = Array.isArray(maSVParam) ? maSVParam[0] : maSVParam;
    const sinhVien = await timSinhVienTheoMa(maSV);

    if (!sinhVien) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tìm sinh viên thành công',
      data: sinhVien,
    });
  } catch (error) {
    next(error);
  }
};

export const createSinhVien = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sinhVienMoi = await themSinhVien(req.body);

    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data: sinhVienMoi,
    });
  } catch (error) {
    next(error);
  }
};
