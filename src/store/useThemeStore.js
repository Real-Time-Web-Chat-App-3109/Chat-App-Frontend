import {create} from "zustand";

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("chat-theme")||"coffee",
    setTheme:(theme)=>{
        console.log("test")
        localStorage.setItem("chat-theme",theme);
        set({theme})
    }
})); 