export const TransferToFormData = (data: any) => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] === undefined) {
      continue;
    } else if (Array.isArray(data[key])) {
      // Nếu dữ liệu là mảng, lặp qua và thêm từng phần tử vào formData
      data[key].forEach((item: any) => {
        // Kiểm tra xem phần tử có phải là file hay không
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          formData.append(key, item);
        }
      });
    } else if (data[key] instanceof File) {
      // Nếu dữ liệu là file (ví dụ avatar hoặc capwall)
      formData.append(key, data[key]);
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
};
