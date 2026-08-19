import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import uploadMedia from "../lib/uploadMedia";
import api from "../lib/api";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiCamera, FiSave, FiKey, FiShield } from "react-icons/fi";

export default function SettingsPage() {
  const userInfo = useContext(UserContext);

  const [firstName, setFirstName] = useState(userInfo.user?.firstName || "");
  const [lastName, setLastName] = useState(userInfo.user?.lastName || "");
  const [image, setImage] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleProfileUpdate() {
    const token = localStorage.getItem("token");

    if (token != null) {
      try {
        setIsLoading(true);

        const data = {
          firstName: firstName,
          lastName: lastName,
          image: userInfo.user?.image,
        };

        if (image != null) {
          data.image = await uploadMedia(image);
        }

        await api.put("/users/update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
        toast.error("Failed to update profile");
        setIsLoading(false);
      }
    }
  }

  async function handlePasswordUpdate() {
    const token = localStorage.getItem("token");

    if (token != null) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setIsLoading(true);

        const data = {
          password: password,
        };

        await api.put("/users/password", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        userInfo.setUser(null);
        toast.success("Password updated successfully. Please login again.");
        window.location.href = "/login";
      } catch (err) {
        console.log(err);
        toast.error("Failed to update password");
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 flex flex-col items-center gap-8 font-sans overflow-x-hidden">

      <div className="w-full max-w-5xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 z-10">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 border-2 border-accent/40 overflow-hidden flex items-center justify-center shadow-lg group">
            {userInfo.user?.image ? (
              <img
                src={userInfo.user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-4xl text-accent" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-white uppercase tracking-widest flex items-center gap-1.5">
              <FiShield /> Account Settings
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {userInfo.user?.firstName ? `${userInfo.user.firstName} ${userInfo.user.lastName || ''}` : "User Profile"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your personal identification details and security preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-accent/20 border border-accent text-white">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Update Profile</h2>
                <p className="text-xs text-slate-400">Personal details & avatar configuration</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wide">Profile Image</label>
                <div className="relative w-full">
                  <input
                    type="file"
                    id="profile-image-input"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-image-input"
                    className="w-full h-11 bg-slate-950/80 border border-dashed border-white/20 hover:border-accent rounded-xl px-4 flex items-center justify-between cursor-pointer text-xs text-slate-400 hover:text-white transition-all"
                  >
                    <span className="truncate">
                      {image ? image.name : "Choose new image file..."}
                    </span>
                    <FiCamera className="text-lg text-white shrink-0 ml-2" />
                  </label>
                </div>
              </div>
            </div>

          </div>

          <button
            onClick={handleProfileUpdate}
            className="mt-8 w-full h-12 rounded-xl bg-accent hover:bg-accent/80 hover:cursor-pointer text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 group"
          >
            <FiSave className="text-lg group-hover:scale-110 transition-transform" />
            <span>Update Profile</span>
          </button>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Change Password</h2>
                <p className="text-xs text-slate-400">Ensure high security credentials</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wide">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                />
              </div>
            </div>

          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-8 w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 hover:cursor-pointer text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 group"
          >
            <FiKey className="text-lg group-hover:scale-110 transition-transform" />
            <span>Change Password</span>
          </button>
        </div>

      </div>

      {isLoading && <LoadingAnimation />}
    </div>
  );
}