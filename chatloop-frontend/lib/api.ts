export async function getMessagesByRoomId(roomId: string) {
  const res = await fetch(`http://localhost:3000/messages/${roomId}`, {
    cache: "no-store", // Make sure we always get the latest
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch messages for room ${roomId}`);
  }

  return res.json();
}
