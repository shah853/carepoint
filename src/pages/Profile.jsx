import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <p className="text-center py-16 text-gray-600">
        Please log in to view your profile
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-md">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Account</p>
      <h1 className="mt-2 mb-7 text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</p>
          <p className="mt-1 font-semibold text-slate-800">{user.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
          <p className="mt-1 font-semibold text-slate-800">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
          <p className="mt-1 font-semibold capitalize text-slate-800">{user.role}</p>
        </div>
      </div>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
      </div>
    </div>
  );
}

export default Profile;