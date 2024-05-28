"use client"
import React, { useState, useEffect } from 'react';

export default function LectureDetails() {
  const [lecture, setLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    async function fetchLectureDetails() {
      try {
        const token = localStorage.getItem("token");
        const  res = await fetch('/api/user/getLectureDetails', {
            //@ts-ignore
            headers: {
              Authorization: token
            }
          });
        if (!res.ok) {
          throw new Error('Failed to fetch lecture details');
        }
        const data = await res.json();
        setLecture(data);
      } catch (error) {
        console.error('Error fetching lecture details:', error);
      }
    }

    fetchLectureDetails();
  }, []);

  return (
    <div className="container mx-auto">
      {lecture ? (
        <div className="max-w-md mx-auto bg-white shadow-md overflow-hidden rounded-lg">
          <img className="w-full h-64 object-cover" src={lecture.course.image} alt="Course Image" />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{lecture.course.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{lecture.course.description}</p>
            <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Level:</span> {lecture.course.level}</p>
            <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Date:</span> {new Date(lecture.date).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

interface Lecture {
  id: number;
  date: string;
  course: {
    name: string;
    level: string;
    description: string;
    image: string;
    id: number;
  };
}
