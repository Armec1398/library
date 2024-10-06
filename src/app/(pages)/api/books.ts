import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'db.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  const jsonData = JSON.parse(data);
  
  // برای درخواست‌های GET
  if (req.method === 'GET') {
    res.status(200).json(jsonData.books); // داده‌های کتاب‌ها
  } 
  // برای درخواست‌های POST
  else if (req.method === 'POST') {
    const newBook = req.body;
    jsonData.books.push(newBook);
    fs.writeFileSync(dbFilePath, JSON.stringify(jsonData, null, 2));
    res.status(201).json(newBook);
  } 
  // برای درخواست‌های دیگر (مثل DELETE و PUT)
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
