// components/RoomList.tsx

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  createdAt: string;
}

export default function RoomList() {
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [notJoinedRooms, setNotJoinedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
    const token = Cookies.get("access_token");
    const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, [token]);

  const fetchRooms = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3000/rooms/joined-and-not", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data = await res.json();
      setJoinedRooms(data.joinedRooms || []);
      setNotJoinedRooms(data.notJoinedRooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to join this room?")) return;
    try {
      const res = await fetch("http://localhost:3000/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) throw new Error("Failed to join room");

      await fetchRooms();
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const leaveRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to leave this room?")) return;
    try {
      const res = await fetch("http://localhost:3000/rooms/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) throw new Error("Failed to leave room");

      await fetchRooms();
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  if (loading) return <p className="mt-6 text-gray-500">Loading rooms...</p>;

  return (
    <div className="mt-6 w-full max-w-sm bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>

      {/* Joined Rooms */}
      {/* Joined Rooms */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-600">Joined Rooms</h3>
        {joinedRooms.length > 0 ? (
          <ul className="space-y-2">
            {joinedRooms.map((room) => (
              <li
                key={room.id}
                className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => router.push(`/rooms/${room.id}`)}>
                <div>
                  {room.name}
                  <span className="text-gray-500 text-sm block">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent redirect when clicking leave
                    leaveRoom(room.id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Leave
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No joined rooms</p>
        )}
      </div>

      {/* Not Joined Rooms */}
      <div>
        <h3 className="text-lg font-semibold text-red-600">Not Joined Rooms</h3>
        {notJoinedRooms.length > 0 ? (
          <ul className="space-y-2">
            {notJoinedRooms.map((room) => (
              <li
                key={room.id}
                className="flex justify-between items-center border-b pb-2">
                <div>
                  {room.name}
                  <span className="text-gray-500 text-sm block">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => joinRoom(room.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Join
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No available rooms</p>
        )}
      </div>
    </div>
  );
}
