import { useState } from "react";
import { Edit, Trash } from "iconsax-react";
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
import AddButton from "../../shared/AddButton";
import { fetchUsers } from "./api";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";

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
    setSelectedUser({});
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

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
    <div className="px-3">
      {/* Add User Button */}
      <div className="w-full flex items-center justify-end h-[32px]">
        {["client_owner", "client_admin"].includes(
          auth.role
        ) && (
          <AddButton
            onClick={() => handleDialogOpen("Add")}
            label={"+ Invite User"}
          />
        )}
      </div>

      {/* User Table */}
      <div className="w-full my-3">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#2B313E] text-xs font-bold border-b-2 border-black">
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
                    } h-[50px] border-b-2`}
                  >
                    <td
                      className={
                        "font-bold text-[#2B313E] py-2 px-4 text-xs"
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
                          size={16}
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
                            size={16}
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
              : data?.data && (
                  <tr
                    className={`${"bg-[#EBEBEB80]"} h-[50px] border-b-2`}
                  >
                    <td
                      className={
                        "font-bold text-[#2B313E] py-2 px-4 text-sm"
                      }
                    >
                      {" "}
                      {data?.data.name}
                    </td>
                    <TableCell>
                      {data?.data.user.email}
                    </TableCell>
                    <TableCell>
                      {USER_TYPE[data?.data.user.role]}
                    </TableCell>
                    <TableCell>
                      {data?.data.accessibility
                        ? ACCESSIBILITY[
                            data?.data.accessibility
                          ]
                        : "All Jobs"}
                    </TableCell>
                    <TableCell>
                      {data?.data.created_at}
                    </TableCell>
                    <td className="py-2 px-4 ">
                      <div className="flex gap-2">
                        <Edit
                          size={16}
                          color="#171717"
                          className="hover:scale-110 hover:duration-150 cursor-pointer"
                          onClick={() => {
                            handleDialogOpen("Edit");
                            setSelectedUser(data?.data);
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
            size="small"
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
      className={`py-2 px-4 text-xs text-[#4F4F4F] ${className}`}
    >
      {children}
    </td>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
