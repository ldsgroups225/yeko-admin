export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Yeko Admin
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
          Welcome to your admin dashboard. Please sign in to continue.
        </p>
        <div className="space-y-4">
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
