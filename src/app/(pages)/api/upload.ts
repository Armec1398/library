import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // غیرفعال کردن bodyParser پیش‌فرض
  },
};

const uploadDir = path.join(process.cwd(), '/public/images'); // مسیر ذخیره تصویر

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      multiples: false, // فقط یک فایل آپلود شود
    });

    // پردازش فایل آپلود شده
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing files' });
        return;
      }

      // دسترسی به فایل آپلود شده
      const file = files.cover_image as any;
      const tempPath = file.filepath;
      const fileName = file.originalFilename;
      const savePath = path.join(uploadDir, fileName);

      try {
        // انتقال فایل به پوشه public/images
        await fs.copyFile(tempPath, savePath);
        res.status(200).json({ path: `/images/${fileName}` });
      } catch (error) {
        res.status(500).json({ message: 'Error saving file' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
