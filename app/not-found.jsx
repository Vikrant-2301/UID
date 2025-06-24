export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-bold text-blue-700">404</h1>
        <p className="text-xl mt-2 text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <a href="/" className="text-blue-500 underline mt-4 inline-block">
          Go back home
        </a>
      </div>
    </div>
  );
}
