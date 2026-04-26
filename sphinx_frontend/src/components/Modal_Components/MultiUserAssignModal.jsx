import { UserPlus, UserPlus2 } from "lucide-react";
import {
  Avatar,
  StyledTable,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "../../styles/AssignUsersPage.styles";
import Modal from "../Modal";
// import { Avatar } from "radix-ui";

export default function MultiSelectModal({
  isMultiSelectModalOpen,
  setIsMultiSelectModalOpen,
  availableUsers,
  selectedUsersConfig,
  handleUserSelection,
  nameToHue,
  initials,
  updateAllowedAttempts,
  updateTimeoutDays,
  addSelectedUsers,
  handleUserSelectAll,
}) {
  if (!isMultiSelectModalOpen) return <></>;

  return (
    <Modal
      isOpen={isMultiSelectModalOpen}
      size={"100%"}
      onClose={() => setIsMultiSelectModalOpen(false)}
      title={
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus size={24} className="text-blue-600" />
            Assign Multiple Users
          </h3>
        </div>
      }
    >
      {/* Modal Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        {availableUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              No available users to assign
            </p>
            <p className="text-gray-400 text-sm mt-2">
              All users are already assigned
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <StyledTable role="table" aria-label="Assigned users table">
              <THead className="p-4">
                <tr>
                  <Th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <span className="">
                      <input
                        type="checkbox"
                        // checked={}
                        onChange={(e) => handleUserSelectAll(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </span>
                  </Th>
                  <Th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </Th>
                  <Th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Allowed Attempts
                  </Th>
                  <Th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Timeout Days
                  </Th>
                </tr>
              </THead>
              <TBody className="bg-white divide-y divide-gray-200">
                {availableUsers.map((user) => {
                  const isSelected = selectedUsersConfig.some(
                    (item) => item.user.partyId === user.partyId,
                  );
                  const config = selectedUsersConfig.find(
                    (item) => item.user.partyId === user.partyId,
                  );
                  return (
                    <Tr
                      key={user.partyId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Td className="px-2 py-1 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleUserSelection(user, e.target.checked)
                          }
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </Td>
                      <Td className="px-2 py-1 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            $hue={nameToHue(user.firstName)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          >
                            {initials(user.firstName + " " + user.lastName)}
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td className="px-2 py-1 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={isSelected ? config?.allowedAttempts || 1 : ""}
                          onChange={(e) =>
                            updateAllowedAttempts(
                              user.partyId,
                              e.target.value || 1,
                            )
                          }
                          disabled={!isSelected}
                          className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            isSelected
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-400"
                          }`}
                          placeholder="Attempts"
                        />
                      </Td>
                      <Td className="px-2 py-1 whitespace-nowrap">
                        <input
                          type="number"
                          min="3"
                          value={isSelected ? config?.timeoutDays || "3" : ""}
                          onChange={(e) =>
                            updateTimeoutDays(user.partyId, e.target.value || 3)
                          }
                          disabled={!isSelected}
                          className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            isSelected
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-400"
                          }`}
                          placeholder="Days"
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </StyledTable>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
        <button
          onClick={() => setIsMultiSelectModalOpen(false)}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={addSelectedUsers}
          disabled={selectedUsersConfig.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <UserPlus2 size={18} />
          Add Selected ({selectedUsersConfig.length})
        </button>
      </div>
    </Modal>
  );
}
