import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload';

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

interface CustomUploadFile extends UploadFile {
  uri?: string; 
}

export const convertMediaToFiles = async (media: RcFile[]) => {
  const mediaFiles: CustomUploadFile[] = await Promise.all(
    media.map(async (mediaItem, index) => {
      const { name, type } = mediaItem;

      const fileType = type || (name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg');

      const file: CustomUploadFile = {
        uid: index.toString(), // Add the uid property
        name: name || `media_${index}.${fileType.split('/')[1]}`,
        type: fileType,
        uri: URL.createObjectURL(mediaItem), // Add the custom uri property
      };

      return file;
    })
  );

  return mediaFiles;
};
