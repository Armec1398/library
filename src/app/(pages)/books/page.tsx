"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Blocks } from 'react-loader-spinner';

export interface Book {
  id: number;
  cover_image: string;
  title: string;
  author: string;
  publication_year: number;
  genre: string[];
  description: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [visibleCount, setVisibleCount] = useState(8); // شروع با 8 کارت
  const [loading, setLoading] = useState(false);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Book | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchBooks = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/books')
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error('خطا در حذف کتاب:', error);
    }
  };

  const handleEditClick = (book: Book) => {
    setEditBookId(book.id);
    setEditFormData({ ...book });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (editFormData) {
      try {
        await axios.put(`http://localhost:5000/books/${editBookId}`, editFormData);
        setBooks(
          books.map((book) =>
            book.id === editBookId ? { ...editFormData, id: editBookId } : book
          )
        );
        setEditBookId(null);
        setEditFormData(null);
      } catch (error) {
        console.error('خطا در ویرایش کتاب:', error);
      }
    }
  };

  // پیاده‌سازی IntersectionObserver برای مشاهده کارت آخری
  useEffect(() => {
    const currentObserverRef = observerRef.current; // ذخیره‌سازی مقدار فعلی ref

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setVisibleCount((prevCount) => prevCount + 4); // اضافه کردن 4 کارت
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0, // کارت باید کامل مشاهده شود
      }
    );

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loading]);

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-col-6 grid-cols-2 gap-4">
        {books.slice(0, visibleCount).map((book, index) => (
          <div
            className="card bg-slate-300 dark:bg-white rounded-md"
            key={book.id}
            ref={index === visibleCount - 1 ? observerRef : null} // تنظیم مرجع برای کارت آخری
          >
            <Image
              src={book.cover_image}
              alt="تصویر کتاب"
              width={90}
              height={100}
              className="rounded-t-md object-cover w-full h-[250px]"
            />
            <div className="p-3">
              {editBookId === book.id ? (
                <div>
                  <input
                    type="text"
                    name="title"
                    value={editFormData?.title}
                    onChange={handleEditChange}
                    placeholder="نام کتاب"
                    className="border rounded-md w-full"
                  />
                  <input
                    type="text"
                    name="author"
                    value={editFormData?.author}
                    onChange={handleEditChange}
                    placeholder="نویسنده"
                    className="border rounded-md w-full mt-2"
                  />
                  <input
                    type="text"
                    name="publication_year"
                    value={editFormData?.publication_year}
                    onChange={handleEditChange}
                    placeholder="سال انتشار"
                    className="border rounded-md w-full mt-2"
                  />
                  <input
                    type="text"
                    name="genre"
                    value={editFormData?.genre.join(', ')}
                    onChange={handleEditChange}
                    placeholder="ژانر"
                    className="border rounded-md w-full mt-2"
                  />
                  <textarea
                    name="description"
                    value={editFormData?.description}
                    onChange={handleEditChange}
                    placeholder="خلاصه"
                    className="border rounded-md w-full mt-2"
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-md mt-2"
                    onClick={handleEditSubmit}
                  >
                    ذخیره
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg">نام کتاب: {book.title}</h2>
                  <h3 className="text-sm">نویسنده: {book.author}</h3>
                  <h3 className="text-sm">سال انتشار: {book.publication_year}</h3>
                  <h3 className="text-sm">ژانر: {book.genre.join(', ')}</h3>
                  <p className="text-xs">خلاصه کتاب: {book.description}</p>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2 ml-2"
                    onClick={() => handleEditClick(book)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md mt-2"
                    onClick={() => handleDelete(book.id)}
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <Blocks
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          visible={true}
        />
      )}
    </>
  );
}
