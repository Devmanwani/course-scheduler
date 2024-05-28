"use client"
import Link from 'next/link';

export default function AppBar() {
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold">Admin</div>
        <div className="space-x-4">
          <Link href="/admin/getInstructors">
            <div className="text-white">View Instructors</div>
          </Link>
          <Link href="/admin">
             <div className="text-white">Add Course</div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
