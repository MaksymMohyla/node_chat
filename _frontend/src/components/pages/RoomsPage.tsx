import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Room } from '../../features/types';
import { publicAxiosInstance } from '../../api/axios';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Inputs = {
  name: string;
};

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<{ success: string; error: string }>({
    success: '',
    error: '',
  });
  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    (async function fetchRooms() {
      try {
        const response = await publicAxiosInstance.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching rooms:', error.response?.data);
          setMessages({
            success: '',
            error: error.response?.data || 'Failed to fetch rooms',
          });
        } else {
          console.error('Unexpected error:', error);
          setMessages({
            success: '',
            error: 'An unexpected error occurred',
          });
        }
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const response = await publicAxiosInstance.post(
        '/rooms/create',
        formData,
      );
      setMessages({
        success: `Room ${formData.name} created succesfully!`,
        error: '',
      });
      setRooms((prevRooms) => [...prevRooms, response.data.room as Room]);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating room:', error.response?.data);
        setMessages({
          success: '',
          error: error.response?.data || 'Creation failed',
        });
      } else {
        console.error('Unexpected error:', error);
        setMessages({
          success: '',
          error: 'An unexpected error occurred',
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=400"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
          Create room
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-300"
            >
              New room name
            </label>
            <div className="mt-2">
              <input
                {...register('name')}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-100 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-400 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Confirm
            </button>
          </div>

          {messages.success && (
            <p className="mt-2 text-sm/6 text-green-500">{messages.success}</p>
          )}
          {messages.error && (
            <p className="mt-2 text-sm/6 text-red-500">{messages.error}</p>
          )}
        </form>
      </div>

      <div className="mt-10">
        <h3 className="mb-2 text-gray-400 font-semibold">Existing rooms:</h3>
        <ul className="space-y-6">
          {rooms.map((room) => (
            <li key={room.id} className="flex items-center gap-3">
              <Link
                to={`/rooms/${room.id}`}
                className="rounded bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-400 transition"
              >
                Join
              </Link>
              <span className="text-gray-200">{room.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomsPage;
