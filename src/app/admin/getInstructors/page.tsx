"use client"

import React, { useState, useEffect } from 'react';

export default function InstructorsList() {
  const [instructors, setInstructors] = useState<User[]>([]);

  useEffect(() => {
    async function fetchInstructors() {
      try {
        const token = localStorage.getItem("token");
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">List of Instructors</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {instructors.map((instructor) => (
            <tr key={instructor.id}>
              <td className="px-6 py-4 whitespace-nowrap">{instructor.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{instructor.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{instructor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
}
