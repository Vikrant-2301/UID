//app\thank-you\page.jsx
export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-600">
          Your Unique ID has been successfully generated.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
