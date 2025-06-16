import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-2xl font-bold">CarTrader</h1>
          <p className="text-sm text-gray-400">© 2025 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
