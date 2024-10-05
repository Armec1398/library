"use client"
import Books from "./(pages)/books/page";
import { Header } from "./components/header.tsx/header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-5  px-2">
        <Books />
      </div>
      
    </>
  );
}
