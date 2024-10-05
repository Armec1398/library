"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage"; // متد کمکی برای برش تصویر
import { Header } from "@/app/components/header.tsx/header";
import { Book } from "../books/page";
import { Area } from "react-easy-crop";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [summary, setSummary] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setBooks] = useState<Book[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setFile] = useState<File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    summary: "",
    file: "",
  });

  // زمانی که modalIsOpen تغییر کند، به body کلاس no-scroll اضافه یا حذف می‌شود
  useEffect(() => {
    if (modalIsOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // پاک کردن اثر زمانی که کامپوننت unmount شود
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [modalIsOpen]);

  const handleOpenFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // حالت‌های مربوط به برش تصویر
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropButton, setShowCropButton] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels); // اینجا نوع Area صحیح است
      setShowCropButton(true);
    },
    []
  );
  

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowCropButton(true);
    }
  };

  const handleCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels) { // بررسی می‌کنیم که croppedAreaPixels تهی نباشد
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, {
          width: 300,
          height: 300,
        });
        setCroppedImage(croppedImage);
        setShowCropButton(false);
        setModalIsOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: title ? "" : "این فیلد اجباری است",
      author: author ? "" : "این فیلد اجباری است",
      year: year ? "" : "این فیلد اجباری است",
      genre: genre ? "" : "این فیلد اجباری است",
      summary: summary ? "" : "این فیلد اجباری است",
      file: croppedImage ? "" : "لطفاً یک فایل انتخاب کنید", // چک کردن انتخاب فایل
    };
  
    setErrors(newErrors);
  
    // بررسی آیا خطایی وجود دارد یا نه
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }
    const newBook = {
      title,
      author,
      publication_year: parseInt(year),
      genre: genre.split(","),
      description: summary,
      cover_image: croppedImage, // استفاده از تصویر برش خورده
    };

    try {
      const response = await axios.post("http://localhost:5000/books", newBook);
      setBooks((prevBooks) => [...prevBooks, response.data]);
      alert("کتاب با موفقیت ثبت شد!");

      // پاک کردن فیلدها پس از ثبت
      setTitle("");
      setAuthor("");
      setYear("");
      setGenre("");
      setSummary("");
      setImageSrc(null);
      setCroppedImage(null);
      setErrors({
        title: "",
        author: "",
        year: "",
        genre: "",
        summary: "",
        file: "",
      });
    } catch (error) {
      console.error("خطا در افزودن کتاب:", error);
    }
  };

  // تابع برای حذف عکس انتخاب شده
  const handleRemoveImage = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setShowCropButton(false);
    setFile(null);
  };


  return (
    <>
      <Header />
      <div className="container mx-auto m-5 p-5 pt-10 pb-0 bg-white rounded-md">
        <div className="grid md:grid-cols-3 sm:grid-col-6 grid-cols-2 gap-4">
          <div className="flex-row">
            <input
              className="border-2 border-gray-300 hover:bg-gray-200 rounded-md bg-gray-300 placeholder:text-black py-2 px-3 h-fit inline w-full"
              type="text"
              placeholder="عنوان"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="text-red-500 text-xs inline">{errors.title}</span>}
          </div>
          <div className="flex-row">
            <input
              className="border-2 border-gray-300 hover:bg-gray-200 rounded-md bg-gray-300 placeholder:text-black py-2 px-3 h-fit inline w-full"
              type="text"
              placeholder="نویسنده"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            {errors.author && <span className="text-red-500 text-xs inline">{errors.author}</span>}
          </div>
          <div className="flex-row">
            <input
              className="border-2 border-gray-300 hover:bg-gray-200 rounded-md bg-gray-300 placeholder:text-black py-2 px-3 h-fit inline w-full fa-number"
              type="text"
              placeholder="سال انتشار"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            {errors.year && <span className="text-red-500 text-xs inline">{errors.year}</span>}
          </div>
          <div className="flex-row">
            <input
              className="border-2 border-gray-300 hover:bg-gray-200 rounded-md bg-gray-300 placeholder:text-black py-2 px-3 h-fit inline w-full"
              type="text"
              placeholder="ژانر"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            {errors.genre && <span className="text-red-500 text-xs inline">{errors.genre}</span>}
          </div>
          <div className="flex-row">
            <textarea
              className="border-2 border-gray-300 hover:bg-gray-200 rounded-md bg-gray-300 placeholder:text-black py-2 px-3 resize-none h-fit inline w-full"
              placeholder="خلاصه کتاب"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            ></textarea>
            {errors.summary && <span className="text-red-500 text-xs inline">{errors.summary}</span>}
          </div>
          <div className="mt-4">
          {croppedImage &&(
                  <Image
                    src={croppedImage}
                    alt="تصویر برش خورده"
                    width={300}
                    height={200}
                    className="rounded"
                    style={{width:"100%"}}
                  />
              )}
              <div className="flex-row">
                <button
                  className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-white w-[49%] ml-2"
                  onClick={() => setModalIsOpen(true)}
                >
                  انتخاب فایل
                </button>
                {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
                {imageSrc && 
                  <button
                    className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md text-white mt-4 w-[49%]"
                    onClick={handleRemoveImage}
                  >
                    حذف عکس
                  </button>
                }
              </div>
          </div>
        </div>

        {modalIsOpen && (
          <div className="modal-overlay">
            <div className="modal w-[90%] sm:w-[40%] text-center">
              {imageSrc ? (
                <div className="mt-4">
                  <div className="relative w-full h-[500px]">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={300 / 300} // نسبت 300x200
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  {showCropButton && (
                    <div>
                      <button
                      className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md text-white mt-4 ml-2"
                      onClick={handleCrop}
                      >
                        برش تصویر
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md text-white mt-4"
                        onClick={handleRemoveImage}
                      >
                        حذف تصویر
                      </button>
                    </div>
                  )}
                </div>
              ):
              (
                <>
                  <label onClick={handleOpenFileInput}>
                    <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 my-4 rounded-md text-white">
                      افزودن فایل
                    </button>
                  </label>
                  <input
                    ref={inputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <button
                    className="close pr-4"
                    onClick={() => setModalIsOpen(false)}
                    style={{ cursor: "pointer" }}
                  >
                    لغو
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <button
          className="bg-green-700 hover:bg-green-600 px-4 py-2 my-4 rounded-md text-white"
          onClick={handleSubmit}
        >
          ثبت
        </button>
      </div>
    </>
  );
}
