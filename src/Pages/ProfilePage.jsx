import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Camera,User,Mail } from "lucide-react";

function ProfilePage() {
  const { authUser, isUpdateingProfile, updateProfile } = useAuthStore();
    const [selectedImg,setSelectedImg]= useState(null);

  const handleImageUpload = async (e) => {
     const file = e.target.files[0];
     if(!file) return;

    const data = new FormData();

    data.append("image",file)

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImg(reader.result);
    };
    reader.readAsDataURL(file);

    await updateProfile(data)
  };


  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/user.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 
                    ${
                      isUpdateingProfile
                        ? "animate-pulse pointer-events-none"
                        : ""
                    }`}
                >
                  <Camera className="w-5 h-5 text-base-200" />  
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUpdateingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdateingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo."}
              </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                    </div>
                    <p className="text-sm text-black flex items-center gap-2">{authUser?.fullName}</p>
                </div>
                <div className="space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </div>
                    <p className="text-sm text-black flex items-center gap-2">{authUser?.email}</p>
                </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                        <span>Member Since</span>
                        <span>{authUser.createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span>Account Status</span>
                        <span className="text-green-500">Active</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { ProfilePage };
