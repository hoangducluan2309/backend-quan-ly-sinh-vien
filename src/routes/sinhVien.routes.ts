import { Router } from 'express';
import {
  createSinhVien,
  getDanhSachSinhVien,
  getSinhVienTheoMa,
} from '../controllers/sinhVien.controller.js';

const router = Router();

router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);
router.post('/', createSinhVien);

export default router;
