function RecBookingsItem({ text, hasAction = false, onClick }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
      <p className="text-gray-700">{text}</p>
      {hasAction && (
        <button
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          onClick={onClick}
        >
          View
        </button>
      )}
    </div>
  );
}

export default RecBookingsItem;