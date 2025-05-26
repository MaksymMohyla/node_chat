import { NavLink, useNavigate } from 'react-router-dom';
import { styles } from '../utils/styles';
import { useContext } from 'react';
import { UserContext } from '../features/user/UserContext';

const Header = () => {
  const isActive = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? styles.header.nav.navlink.active
      : styles.header.nav.navlink.unactive;

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <header>
      <nav className={styles.header.nav.container}>
        <div className={styles.header.nav.linkContainer}>
          <NavLink to="" className={isActive}>
            Home
          </NavLink>

          {user && (
            <NavLink to="rooms" className={isActive}>
              Rooms
            </NavLink>
          )}
        </div>
        <div className={styles.header.nav.linkContainer}>
          {!user && (
            <NavLink to="sign-up" className={isActive}>
              Sign up
            </NavLink>
          )}

          {!user && (
            <NavLink to="login" className={isActive}>
              Login
            </NavLink>
          )}

          {user && (
            <button
              className="text-[1.2rem] px-4 leading-loose block rounded-md hover:bg-gray-700 hover:text-white h-10 bg-gray-500"
              onClick={async () => {
                if (!window.confirm('Are you sure?')) return;
                setUser(null);
                localStorage.removeItem('user');
                navigate('/');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
