import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs'; // استفاده از promises برای async/await
import { join } from 'path';

const filePath = join(process.cwd(), 'db.json'); // مسیر فایل db.json

interface Book {
  id: number;
  cover_image: string;
  title: string;
  author: string;
  publication_year: number;
  genre: string[];
  description: string;
}

interface Data {
  books: Book[];
}

// تابع برای خواندن محتوای db.json
const readData = async (): Promise<Data> => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

// تابع برای نوشتن محتوای جدید در db.json
const writeData = async (data: Data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const data = await readData();

  switch (method) {
    case 'GET':
      res.status(200).json(data.books);
      break;

    case 'POST': {
      const newBook: Book = req.body;
      newBook.id = data.books.length ? data.books[data.books.length - 1].id + 1 : 1; // تعیین ID جدید
      data.books.push(newBook);
      await writeData(data);
      res.status(201).json(newBook);
      break;
    }

    case 'PUT': {
      const { id } = req.query;
      const updatedBook: Book = req.body;
      const bookIndex = data.books.findIndex((book) => book.id === parseInt(id as string));

      if (bookIndex !== -1) {
        data.books[bookIndex] = updatedBook;
        await writeData(data);
        res.status(200).json(updatedBook);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
      break;
    }

    case 'DELETE': {
      const { id } = req.query;
      const updatedBooks = data.books.filter((book) => book.id !== parseInt(id as string));

      if (updatedBooks.length !== data.books.length) {
        data.books = updatedBooks;
        await writeData(data);
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
