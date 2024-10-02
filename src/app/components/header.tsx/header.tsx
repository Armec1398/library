import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { Sling as Hamburger } from 'hamburger-react';


export const Header=()=>{
        const [isOpen, setIsOpen] = useState(false);
      
        const toggleDropdown = () => {
          setIsOpen(!isOpen);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return(
        <>
            <nav className="bg-stone-100 py-2">
                <div className="container mx-auto flex flex-row justify-between items-center">
                    <div className="w-1/6 flex justify-end sm:hidden z-50 sm:order-2">
                            <Hamburger toggled={isMenuOpen} toggle={setIsMenuOpen} />
                    </div>
                    <div className={`${
                            isMenuOpen ? 'block' : 'hidden'
                        } sm:flex flex-col sm:flex-row absolute sm:static bg-gray-300 sm:bg-transparent top-0 right-0 w-full h-full sm:w-6/6 z-30 px-4 pt-16 sm:p-0 gap-4`}>
                        <div className="nav-item">
                            <Link href="/addbook">افزودن کتاب جدید</Link>
                        </div>
                        <div className="nav-item">
                            <Link href="/">لیست کتاب ها</Link>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/6 flex sm:order-first">
                        <Image src="/images/logo.png" alt="لوگو" width={40} height={40}/>
                    </div>
                    
                    <div className="w-full sm:w-1/6 flex justify-end sm:order-3">
                        <div className="dropdown relative inline-block text-right">
                            <button className="!flex flex-row items-center" onClick={toggleDropdown}>
                                <Image className="rounded-full me-2" src="/images/avatar.jpg" alt="لوگو" width={40} height={40}/>
                            </button>
                            {isOpen && (
                            <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">حساب کاربری</a>
                                <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ویرایش رمز عبور</a>
                                <hr className="my-0"/>
                                <a href="/" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">خروج از حساب کاربری</a>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}