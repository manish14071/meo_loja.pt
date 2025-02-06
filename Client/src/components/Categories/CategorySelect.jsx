import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Loader from "../Loader";
import Message from "../Message";

const CategorySelect = ({ value, onChange, className = "" }) => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <select
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
    >
      <option value="">Select Category</option>
      {categories?.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect; 