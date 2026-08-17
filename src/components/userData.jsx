import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";
import UserContext from "../context/userContext";
import { CiUser } from "react-icons/ci";

export default function UserData(){

    const userData =  useContext(UserContext)

    console.log(userData)

    const [selectedOption, setSelectedOption] = useState("name");
    const navigate = useNavigate();

    const screenWidth = window.innerWidth;

   

    return (
        <>
            {userData.user == null ?
                <>
                    <div className="text-white p-2 hidden lg:block">
                        <Link to="/login">Login </Link>
                        |
                        <Link to="/register"> Register</Link>
                    </div>
                    <Link className="h-full aspect-square flex flex-col items-center justify-center" to="/login">
                    <CiUser className="text-4xl text-accent" />
                    <span className="text-accent text-sm">Login</span>
                </Link>

                </>
            :
                <div className="flex flex-col lg:flex-row h-full w-[80px] lg:w-auto lg:h-auto  lg:gap-2 justify-center items-center">
                    <img src={userData.user.image} alt="Avatar" className="w-[40px] h-[40px] rounded-full border border-white lg:p-2"/>
                    <select
                        value={selectedOption}
                        onChange={(e) => {
                            if(e.target.value === "settings"){
                                navigate("/settings");
                            }else if(e.target.value === "my-orders"){
                                navigate("/my-orders");
                            }else if(e.target.value === "logout"){
                                localStorage.removeItem("token");
                                userData.setUser(null);
                                navigate("/login");
                            }
                        }}
                        className="lg:bg-accent text-accent lg:text-white lg:p-2 rounded text-right max-w-[80px]">
                        <option value="name">{
                            screenWidth < 1024 ? userData.user.firstName : userData.user.firstName + " " + userData.user.lastName
                        }</option>
                        <option value="settings">Settings</option>
                        <option value="my-orders">My Orders</option>
                        <option value="logout">Logout</option>
                    </select>
                </div>
            }

            
        </>
    )
}
