
function InfoCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-800 ml-3">{title}</h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
        {children}
      </div>
    </div>
  );
}

export default InfoCard;