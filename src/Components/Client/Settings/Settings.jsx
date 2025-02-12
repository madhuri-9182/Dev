import { useState } from "react";
import { Edit, Trash } from "iconsax-react";
import axios from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@mui/material";
import {
  ACCESSIBILITY,
  USER_TYPE,
} from "../../Constants/constants";
import PropTypes from "prop-types";
import useAuth from "../../../hooks/useAuth";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";

const fetchUsers = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const response = await axios.get(
    `/api/client/client-user/`,
    {
      params: { limit, offset },
    }
  );
  return response.data.data;
};

function Settings() {
  const { auth } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", currentPage, auth.role],
    queryFn: () => fetchUsers(currentPage),
    keepPreviousData: true,
  });

  const handleDialogOpen = (title) => {
    setDialogOpen(true);
    setDialogTitle(title);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const canShowTrashIcon = (userRole) => {
    if (auth.role === "client_owner") {
      return [
        "client_admin",
        "agency",
        "client_user",
      ].includes(userRole);
    } else if (auth.role === "client_admin") {
      return ["agency", "client_user"].includes(userRole);
    }
    return false; // No trash icon for users
  };

  const handleDeleteUser = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="ml-10">
      {/* Add User Button */}
      <div className="w-full flex items-center justify-end h-[40px]">
        {["client_owner", "client_admin"].includes(
          auth.role
        ) && (
          <button
            className="p-1 px-4 rounded-full text-sm font-semibold text-white w-[125px] h-[40px] 
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
            onClick={() => handleDialogOpen("Add")}
          >
            + Invite User
          </button>
        )}
      </div>

      {/* User Table */}
      <div className="w-full mt-4 mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#2B313E] text-sm font-bold border-b-2 border-black">
              {[
                "USERS",
                "EMAIL ID",
                "USER TYPE",
                "ACCESSIBILITY",
                "ADD DATE",
              ].map((header) => (
                <th key={header} className="py-2 px-4">
                  {header}
                </th>
              ))}
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {["client_owner", "client_admin"].includes(
              auth.role
            )
              ? data?.results &&
                data.results.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#EBEBEB80]"
                        : "bg-[#EBEBEB80]"
                    } h-[70px] border-b-2`}
                  >
                    <td
                      className={
                        "font-bold text-[#2B313E] py-2 px-4 text-sm"
                      }
                    >
                      {" "}
                      {user.name}
                    </td>
                    <TableCell>{user.user.email}</TableCell>
                    <TableCell>
                      {USER_TYPE[user.user.role]}
                    </TableCell>
                    <TableCell>
                      {user.accessibility
                        ? ACCESSIBILITY[user.accessibility]
                        : "All Jobs"}
                    </TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <td className="py-2 px-4 ">
                      <div className="flex gap-2">
                        <Edit
                          size={20}
                          color="#171717"
                          className="hover:scale-110 hover:duration-150 cursor-pointer"
                          onClick={() => {
                            handleDialogOpen("Edit");
                            setSelectedUser(user);
                          }}
                        />
                        {canShowTrashIcon(
                          user.user.role
                        ) && (
                          <Trash
                            size={20}
                            color="#F00"
                            className="hover:scale-110 hover:duration-150 cursor-pointer"
                            onClick={() => {
                              handleDeleteUser(user.id);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              : data && (
                  <tr
                    className={`${"bg-[#EBEBEB80]"} h-[70px] border-b-2`}
                  >
                    <td
                      className={
                        "font-bold text-[#2B313E] py-2 px-4 text-sm"
                      }
                    >
                      {" "}
                      {data.name}
                    </td>
                    <TableCell>{data.user.email}</TableCell>
                    <TableCell>
                      {USER_TYPE[data.user.role]}
                    </TableCell>
                    <TableCell>
                      {data.accessibility
                        ? ACCESSIBILITY[data.accessibility]
                        : "All Jobs"}
                    </TableCell>
                    <TableCell>{data.created_at}</TableCell>
                    <td className="py-2 px-4 ">
                      <div className="flex gap-2">
                        <Edit
                          size={20}
                          color="#171717"
                          className="hover:scale-110 hover:duration-150 cursor-pointer"
                          onClick={() => {
                            handleDialogOpen("Edit");
                            setSelectedUser(data);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
        {["client_owner", "client_admin"].includes(
          auth.role
        ) && (
          <Pagination
            count={Math.ceil(data?.count / 10)}
            className="mt-4 flex justify-end"
            onChange={(e, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
          />
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        title={`${dialogTitle} User`}
        selectedUser={selectedUser}
      />

      {/* Delete User Modal */}
      {deleteModalOpen && (
        <DeleteUserModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          id={deleteId}
        />
      )}
    </div>
  );
}

export default Settings;

const TableCell = ({ children, className }) => {
  return (
    <td
      className={`py-2 px-4 text-sm text-[#4F4F4F] ${className}`}
    >
      {children}
    </td>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
