"use client"
import { headers } from 'next/headers';
import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [instructorId, setInstructorId] = useState<string>('');
  const [lectureDate, setLectureDate] = useState<string>('');

  useEffect(() => {
    async function fetchInstructors() {
        const token = localStorage.getItem("token");
        const withoutBearer = token?.split(" ")[1];
      try {
        const  res = await fetch('/api/admin/getInstructors', {
            //@ts-ignore
            headers: {
              Authorization: token
            }
          });
        
        if (!res.ok) {
          throw new Error('Failed to fetch instructors');
        }
        const data = await res.json();
        setInstructors(data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    }

    fetchInstructors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          level,
          description,
          image,
          instructorId: parseInt(instructorId),
          lectureDate,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Add a New Course</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Level</label>
          <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Image</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Instructor</label>
          <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required>
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Lecture Date</label>
          <input type="date" value={lectureDate} onChange={(e) => setLectureDate(e.target.value)} className="p-2 border border-gray-300 rounded w-full" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Add Course</button>
      </form>
    </div>
  );
}

interface User {
  id: number;
  name: string;
}
