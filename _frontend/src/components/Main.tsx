import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RoomsPage from './pages/RoomsPage';
import { useContext } from 'react';
import { UserContext } from '../features/user/UserContext';
import RoomPage from './pages/RoomPage';

const Main = () => {
  const { user } = useContext(UserContext);
  return (
    <main className="px-4 py-2">
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />

          {user && <Route path="rooms" element={<RoomsPage />} />}

          {user && <Route path="rooms/:id" element={<RoomPage />} />}

          {!user && <Route path="sign-up" element={<SignUpPage />} />}

          {!user && <Route path="login" element={<LoginPage />} />}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </main>
  );
};

export default Main;
