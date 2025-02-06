import React from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { 
    useDeleteUserMutation, 
    useUpdateUserAdminMutation,  // Add this import
    useGetUsersQuery ,
    useUpdateUserMutation
  } from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import AdminMenu from "../../components/Admin/AdminMenu";

const UserList = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000, // Poll every 60 seconds
    refetchOnMountOrArgChange: true, // Refetch when component mounts
    refetchOnFocus: true, // Refetch when window regains focus
  });

  const [deleteUser] = useDeleteUserMutation();
  //const [updateUser] = useUpdateUserMutation();
  const [updateUserAdmin] = useUpdateUserAdminMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        console.log("Deleting user with ID:", id); // Add this for debugging
        const result = await deleteUser(id);

        if (result.error) {
          throw new Error(
            result.error.data?.message || "Failed to delete user"
          );
        }

        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        console.error("Delete error:", err); // Add this for debugging
        toast.error(
          err?.data?.message || err.message || "Failed to delete user"
        );
      }
    }
  };

  const toggleAdmin = async (id, currentStatus) => {
    try {
      await updateUserAdmin({
        userId: id,
        isadmin: !currentStatus
      }).unwrap();
      
      toast.success('User admin status updated successfully');
      refetch();
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err?.data?.message || 'Failed to update user status');
    }
  };
  // ... rest of the component ...

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
        <div className="md:col-span-3">
          <h1 className="text-2xl font-semibold mb-4">Users</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ADMIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-black">
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.id}{" "}
                      {/* Make sure this is the correct property name */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAdmin(user.id, user.isadmin)}
                        className={`p-1 rounded ${
                          user.isadmin
                            ? "text-green-600 hover:text-green-700"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        {user.isadmin ? (
                          <FaCheck className="text-xl" />
                        ) : (
                          <FaTimes className="text-xl" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => deleteHandler(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
