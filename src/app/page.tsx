"use client"
import Books from "./(pages)/books/page";
import { Header } from "./components/header.tsx/header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="text-2xl border-r-4 pr-4 mb-5 border-red-700">لیست کتاب ها</h1>
        <Books />
      </div>
    </>
  );
}
