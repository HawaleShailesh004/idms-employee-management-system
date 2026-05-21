import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, title, subHeader }) => {
  const { logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard__topbar">
        <div className="dashboard__brand">
          <img src="/assets/idms_logo.svg" alt="IDMS" className="dashboard__logo" />
        </div>
        <div className="dashboard__topbar-right">
          <button type="button" className="dashboard__user-btn" onClick={logout} title="Logout">
            <img src="/assets/user_avatar.svg" alt="User" />
          </button>
        </div>
      </header>

      <div className="dashboard__body">
        <Sidebar />
        <main className="dashboard__main">
          <div className="dashboard__page-header">
            <h1 className="dashboard__title">{title}</h1>
            {subHeader}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
