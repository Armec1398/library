import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // غیرفعال کردن bodyParser پیش‌فرض
  },
};

const uploadDir = path.join(process.cwd(), '/public/images'); // مسیر ذخیره تصویر

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      multiples: false, // فقط یک فایل آپلود شود
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing files' });
        return;
      }

      // دسترسی به فایل آپلود شده
      const file = Array.isArray(files.cover_image) ? files.cover_image[0] : files.cover_image;

      if (file) {
        const tempPath = (file as FormidableFile).filepath;
        const originalFileName = (file as FormidableFile).originalFilename;
        const fileName = originalFileName ? originalFileName : 'default-filename.jpg'; // یا هر نام پیش‌فرض دلخواه
        
        const savePath = path.join(uploadDir, fileName);

        try {
          // انتقال فایل به پوشه public/images
          await fs.copyFile(tempPath, savePath);
          res.status(200).json({ path: `/images/${fileName}` });
        } catch {
          res.status(500).json({ message: 'Error saving file' });
        }
      } else {
        res.status(400).json({ message: 'No file uploaded' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
