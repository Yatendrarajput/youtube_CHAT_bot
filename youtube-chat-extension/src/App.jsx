function App() {
  return (
    <div className="w-80 p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          YouTube Chat
        </h1>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-600 text-sm mb-4">
          Go to any YouTube video and click the chat button to start!
        </p>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Open any YouTube video</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Click the purple chat button (bottom-right)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Ask questions about the video!</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Go to YouTube →
        </a>
      </div>
    </div>
  );
}

export default App;