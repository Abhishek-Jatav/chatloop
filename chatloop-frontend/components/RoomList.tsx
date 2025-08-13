// components/RoomList.tsx

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/joined-and-not`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data = await res.json();
      setJoinedRooms(data.joinedRooms || []);
      setNotJoinedRooms(data.notJoinedRooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to join this room?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) throw new Error("Failed to join room");

      toast.success("Joined room successfully");
      await fetchRooms();
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room");
    }
  };

  const leaveRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to leave this room?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roomId }),
        }
      );

      if (!res.ok) throw new Error("Failed to leave room");

      toast.success("Left room successfully");
      await fetchRooms();
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("Failed to leave room");
    }
  };

  if (loading)
    return <p className="mt-6 text-gray-300 text-lg">Loading rooms...</p>;

  return (
    <div className="mt-6 w-full max-w-2xl bg-gray-900 text-white shadow-md rounded-lg p-6 text-lg mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Rooms
      </h2>

      {/* Joined Rooms */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-400 mb-2">
          Joined Rooms
        </h3>
        {joinedRooms.length > 0 ? (
          <ul className="space-y-3">
            {joinedRooms.map((room) => (
              <li
                key={room.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-700 pb-3 hover:bg-gray-800 p-3 rounded cursor-pointer transition"
                onClick={() => router.push(`/rooms/${room.id}`)}>
                <div>
                  {room.name}
                  <span className="text-gray-400 text-sm block">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    leaveRoom(room.id);
                  }}
                  className="mt-2 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Leave
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No joined rooms</p>
        )}
      </div>

      {/* Not Joined Rooms */}
      <div>
        <h3 className="text-xl font-semibold text-blue-400 mb-2">
          Not Joined Rooms
        </h3>
        {notJoinedRooms.length > 0 ? (
          <ul className="space-y-3">
            {notJoinedRooms.map((room) => (
              <li
                key={room.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-700 pb-3">
                <div>
                  {room.name}
                  <span className="text-gray-400 text-sm block">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => joinRoom(room.id)}
                  className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Join
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No available rooms</p>
        )}
      </div>
    </div>
  );
}
