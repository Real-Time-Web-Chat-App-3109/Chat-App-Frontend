import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import { Plus, Users } from "lucide-react";
import { SidebarSkeleton } from "./skeletons/SlidebarSkeleton";
import { useRef } from "react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    creatGroup,
    groups,
    setSelectedGroup,
    selectedGroup,
    getGroups
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const dailog = useRef(null)

  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers,getGroups]);

  const filteredUsers = onlineUsers
    ? [
        ...users.filter((user) => onlineUsers.includes(user._id)),
        ...users.filter((user) => !onlineUsers.includes(user._id)),
      ]
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length === 1 ? 0 : onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        <div className="flex flex-col gap-1 max-h-[42%] max-sm:max-h-[40%] overflow-y-scroll no-scrollbar">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() =>{setSelectedUser(user);setSelectedGroup(null);}}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 hover:rounded-box transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300 rounded-box"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/user.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
        <div className="divider"></div>
        <span className="w-full flex max-md:flex-col max-md:items-center justify-between px-4 max-md:h-[50px]">
          Groups
          <Plus
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            {/* open modal */}
          </Plus>
        </span>

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setGroupName("");
                  setGroupUsers([]);
                }}
                ref={dailog}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Group Name</h3>
            <input
              type="text"
              placeholder="Type here"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <div className="flex flex-col gap-1 h-56 overflow-y-scroll no-scrollbar mt-3">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() =>
                    setGroupUsers((prev) =>
                      prev.includes(user._id)
                        ? prev.filter((userId) => userId !== user._id)
                        : [...prev, user._id]
                    )
                  }
                  className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 hover:rounded-box transition-colors
              ${
                groupUsers.includes(user._id)
                  ? "bg-base-300 ring-1 ring-base-300 rounded-box"
                  : ""
              }
            `}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || "/user.png"}
                      alt={user.name}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                      />
                    )}
                  </div>

                  {/* User info - only visible on larger screens */}
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div
              className="w-full text-center"
              onClick={() =>{
                creatGroup({ groupName, members: groupUsers });
                dailog?.current?.click();
              }}
            >
              <button className="btn btn-active btn-primary">Create</button>
            </div>
          </div>
        </dialog>
        <div className="divider"></div>
        <div className="flex flex-col gap-1 max-h-[55%] max-sm:max-h-[65%] overflow-y-scroll no-scrollbar">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {setSelectedGroup(group);setSelectedUser(null)}}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 hover:rounded-box transition-colors
              ${
                selectedGroup?._id === group._id
                  ? "bg-base-300 ring-1 ring-base-300 rounded-box"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={"/user.png"}
                  alt={group.groupName}
                  className="size-12 object-cover rounded-full"
                />
                {/* {onlineUsers.includes(group._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )} */}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.groupName}</div>
                {/* <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(group._id) ? "Online" : "Offline"}
                </div> */}
              </div>
            </button>
          ))}

          {groups.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No groups
            </div>
          )}
        </div>

        <div className="card  grid  place-items-center"></div>
      </div>
    </aside>
  );
};
export { Sidebar };
