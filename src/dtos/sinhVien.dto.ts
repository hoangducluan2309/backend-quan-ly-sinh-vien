// DTO (Data Transfer Object): định nghĩa cấu trúc dữ liệu
// mà ứng dụng sẽ trao đổi giữa các tầng, ví dụ: controller, service, client.
// File này chỉ mô tả dữ liệu, chưa lưu trữ hay kết nối database.

export interface ISinhVienDTO {
  maSV: string;
  hoTen: string;
  email: string;
  maLop: string;
}

// Ví dụ dữ liệu hợp lệ theo DTO:
// const sinhVien: ISinhVienDTO = {
//   maSV: 'SV001',
//   hoTen: 'Minh Nhật',
//   email: 'minhnhat@example.com',
//   maLop: '25CT114'
// };

// Lưu ý:
// - TypeScript chỉ kiểm tra code TypeScript, không tự động kiểm tra JSON
//   được gửi từ Postman hoặc frontend khi request đến server.
// - Người dùng vẫn phải kiểm tra dữ liệu trong controller/service trước khi lưu.
