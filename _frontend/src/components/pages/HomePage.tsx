import { useContext, useEffect, useState } from 'react';
import '../../assets/styles/App.css';
import { UserContext } from '../../features/user/UserContext';
import { User } from '../../features/types';
import { publicAxiosInstance } from '../../api/axios';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      publicAxiosInstance.get('/users').then((res) => setUsers(res.data));
    } else {
      setUsers([{ id: '0', username: 'You are guest!' }]);
    }
  }, [user]);

  return (
    <>
      <h2 className="text-2xl font-semibold pt-5">{`Hello, ${
        user ? user.username : 'guest'
      }!`}</h2>
      <ul>
        Activated users:
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <div className="perspective-[600px] flex justify-center items-center h-[80vh] bg-[#333]">
        <div className="w-[200px] h-[200px] logo-spin">
          {' '}
          {/* logo-spin is a class from App.css */}
          <img
            className="w-full h-full object-contain"
            src="https://nodejs.org/static/images/logo.svg"
            alt="Spinning Node.js Logo"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
