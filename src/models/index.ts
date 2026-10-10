import { Lop } from './Lop.js';
import { SinhVien } from './SinhVien.js';

Lop.hasMany(SinhVien, { foreignKey: 'maLop', as: 'sinhViens' });
SinhVien.belongsTo(Lop, { foreignKey: 'maLop', as: 'lop' });

export { Lop, SinhVien };
