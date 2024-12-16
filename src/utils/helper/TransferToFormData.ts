import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload';

export const TransferToFormData = (data: any) => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] === undefined) {
      continue;
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => {
        formData.append(key, item as any);
      });
    } else {
      formData.append(key, data[key] as any);
    }
  }

  return formData;
}

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