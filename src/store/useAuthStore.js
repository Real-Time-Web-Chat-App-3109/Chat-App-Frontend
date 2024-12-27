import {create} from "zustand"
import {axiosInstance} from "../lib/axois.js"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
        } catch(error) {
            console.log("Error in CheckAuth", error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth : false})
        }
    },

    signup: async(data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data.data });
            toast.success("Account created successfully");
            // get().connectSocket();
          } catch (error) {
            toast.error(error.response.data.message);
          } finally {
            set({ isSigningUp: false });
          }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data.data });
          toast.success("Logged in successfully");
    
        //   get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            // get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile : async (data) => {
      set({isUpdateingProfile:true});
      try {
        console.log(data);
          const res = await axiosInstance.put("/auth/update-profile",data);
          set({authUser:res.data.data});
          toast.success("ProfileUpdated successfully");
      } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
      }
      finally
      {
          set({isUpdateingProfile:false});
      }
    }
}))