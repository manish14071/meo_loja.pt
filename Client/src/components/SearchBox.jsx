import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?search=${keyword}`);
      setKeyword('');
    } else {
      navigate('/shop');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex">
      <input
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 rounded-l-full text-gray-900 focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-pink-600 text-white rounded-r-full hover:bg-pink-700 focus:outline-none"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox; 