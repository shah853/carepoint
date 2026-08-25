import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="text-center py-16 sm:py-24 px-4">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;