import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axois";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    groups:[],
    selectedUser:null,
    selectedGroup:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async ()=>{
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/getUsers");
            set({users:res.data.data});
        }
        catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading:false})
        }
    },

    getGroups:async ()=>{
        set({isUsersLoading:true});
        try{
            console.log("fetching groups");
            const res = await axiosInstance.get("/messages/getGroups");
            set({groups:res.data.data});
        }
        catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading:false})
        }
    },

    creatGroup:async (data)=>{

        try{
            const res = await axiosInstance.post("/messages/createGroup",data);
            set({groups:[...get().groups,res.data.data]});
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data.data})
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({isMessagesLoading:false})
        }
    },

    getGroupMessage:async(groupId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/groupMessage/getMessages/${groupId}`);
            set({messages:res.data.data})
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage : async (messageData)=>{
        const {selectedUser,messages} = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    sendGroupMessage:async (messageData)=>{
        const {selectedGroup,messages}=get()
        try {
            const res = await axiosInstance.post(`/messages/groupMessage/send/${selectedGroup._id}`,messageData);
            set({messages:[...messages,res.data.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages:()=>{
        const { selectedUser } = get();

        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage)=>{
            // for optimization perpose
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return
            set({
                messages:[...get().messages,newMessage]
            })
        })
    },
    subscribeToGroupMessages:()=>{
        const { selectedGroup } = get();

        if(!selectedGroup) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newGroupMessage", (newMessage)=>{
            // for optimization perpose
            const isMessageSentFromSelectedUser = newMessage.groupId === selectedGroup._id;
            if(!isMessageSentFromSelectedUser) return
            set({
                messages:[...get().messages,newMessage]
            })
        })
    },

    unsubscribeFromMessages:()=>
    {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    
    unsubscribeFromGroupMessages:()=>
    {
        const socket = useAuthStore.getState().socket;
        socket.off("newGroupMessage");
    },

    setSelectedUser : (selectedUser)=>set({selectedUser}),

    setSelectedGroup : (selectedGroup)=>set({selectedGroup})
}))