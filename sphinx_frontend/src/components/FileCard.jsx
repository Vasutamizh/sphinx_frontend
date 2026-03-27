function FileCard({ file, onUpload }) {
  if (!file) return null;

  return (
    <div className="max-w-sm mx-auto mt-6 bg-white shadow-lg rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 p-3 rounded-full">📄</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Uploaded File</h3>
          <p className="text-sm text-gray-500">Ready to process</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-bold">Name:</span> {file.name}
        </p>
        <p>
          <span className="font-bold">Size:</span>
          {(file.size / 1024).toFixed(2)} KB
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-600 transition"
          onClick={onUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default FileCard;
