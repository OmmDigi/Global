import axios, { AxiosError } from "axios";
import imageCompression from "browser-image-compression";

export interface IResponse<T = null> {
  data: T;
  statusCode: number;
  message: string;
  success: boolean;
  key?: string;
  totalPage?: number;
}

export interface IUploadedFile {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType?: string;
  contentDisposition: string;
}

interface IProps<E = AxiosError<IResponse>> {
  url: string;
  files: File[];
  folder: string;

  onUploading?: (percent: number) => void;
  onUploaded?: (result: IUploadedFile[]) => void;
  onError?: (error: E) => void;

  convartToWebp?: boolean;
}

export const uploadFiles = async ({
  url,
  files,
  folder,
  onUploaded,
  onUploading,
  convartToWebp = false,
  onError,
}: IProps) => {
  let data: IUploadedFile[] = [];
  let error: AxiosError<IResponse> | null = null;

  const fileArray = Array.from(files);

  const formData = new FormData();

  formData.set("folder", folder);

  try {
    // compress the image if it's an image file
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        console.warn(`Skipping non-image file: ${file.name}`);
        formData.append("files", file);
        continue;
      }

      // Compress and convert to WebP
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: "image/webp" as const,
      });

      // Ensure it's WebP format
      const webpFile = new File(
        [compressedFile],
        file.name.replace(/\.[^/.]+$/, ".webp"),
        { type: "image/webp" }
      );

      formData.append("files", webpFile);
    }

    const response = await axios.post<IResponse<IUploadedFile[]>>(
      url,
      formData,
      {
        onUploadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / (total || 0));
          onUploading?.(percentCompleted);
        },
      }
    );

    if (onUploaded) {
      onUploaded(response.data.data);
    }

    data = response.data.data;
  } catch (error) {
    error = error as AxiosError<IResponse>;
    onError?.(error as AxiosError<IResponse>);
  } finally {
    return { data, error };
  }
};
