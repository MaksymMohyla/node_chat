import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Room, User } from '../../features/types';
import { publicAxiosInstance } from '../../api/axios';

const RoomPage = () => {
  const { id } = useParams();
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [input, setInput] = useState<string>('');
  const currentUser = JSON.parse(
    localStorage.getItem('user') || 'null',
  ) as User | null;

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await publicAxiosInstance.get(`/rooms/${id}`);
        setRoomInfo(response.data);
      } catch (error) {
        console.error('Error fetching room info:', error);
      }
    };

    if (id) {
      fetchRoomInfo();
    }

    const addUserToRoom = async () => {
      if (currentUser && id) {
        try {
          await publicAxiosInstance.post(`/rooms/${id}/addUser`, currentUser);
        } catch (error) {
          console.error('Error adding user to room:', error);
        }
      }
    };
    addUserToRoom();

    const removeUserFromRoom = async () => {
      if (currentUser && id) {
        try {
          await publicAxiosInstance.patch(`/rooms/${id}/removeUser`, {
            userId: currentUser.id,
          });
        } catch (error) {
          console.error('Error removing user from room:', error);
        }
      }
    };

    return () => {
      removeUserFromRoom();
    };
  }, [id]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3005');

    socket.addEventListener('open', () => {
      if (id) {
        socket.send(JSON.stringify({ type: 'joinRoom', roomId: id }));
      }
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'newMessage' && data.roomId === id) {
        setRoomInfo((prevRoom) => {
          if (prevRoom) {
            return {
              ...prevRoom,
              messages: [...prevRoom.messages, data.message],
            };
          }
          return prevRoom;
        });
      }
      if (data.event === 'userJoined' && data.roomId === id) {
        setRoomInfo((prevRoom) => {
          if (
            prevRoom &&
            !prevRoom.participants.some(
              (participant) => participant.id === data.user.id,
            )
          ) {
            return {
              ...prevRoom,
              participants: [...prevRoom.participants, data.user],
            };
          }
          return prevRoom;
        });
      }
    });

    return () => {
      socket.close();
    };
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !id) return;
    try {
      await publicAxiosInstance.post(`/rooms/${id}/addMessage`, {
        author: currentUser,
        content: input,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setInput('');
  };

  return roomInfo ? (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Room {roomInfo.name}</h1>
      <div className="mb-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Participants:</h2>
        <ul className="list-disc list-inside bg-gray-800 rounded p-4">
          {roomInfo.participants && roomInfo.participants.length > 0 ? (
            roomInfo.participants.map((participant, idx: number) => (
              <li key={idx}>{participant.username}</li>
            ))
          ) : (
            <li>No participants</li>
          )}
        </ul>
      </div>

      <form className="flex w-full max-w-md mt-4" onSubmit={onSubmit}>
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-lg font-semibold mb-2">Messages:</h2>
        <ul className="bg-gray-800 rounded p-4 space-y-2">
          {roomInfo.messages && roomInfo.messages.length > 0 ? (
            roomInfo.messages.map((message, idx: number) => (
              <li key={idx}>
                {message.author.username}: {message.content}
              </li>
            ))
          ) : (
            <li>No messages</li>
          )}
        </ul>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Loading Room...</h1>
      <p className="text-gray-600">
        Please wait while we fetch the room details.
      </p>
    </div>
  );
};

export default RoomPage;
