import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function RegisterPage(){

    const [email , setEmail] = useState("")
    const [firstName , setFirstName] = useState("")
    const [lastName , setLastName] = useState("")
    const [password , setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    const navigate = useNavigate()

    function handleRegister(){

        if(password !== confirmPassword){
            toast.error("Passwords do not match")
            return
        }

        api.post("/users/" , 
            {
                email : email,
                firstName : firstName,
                lastName : lastName,
                password : password
            }
        ).then(
            ()=>{

                toast.success("Registration successful")               

                   
                navigate("/login")


            }
        ).catch(

            (err)=>{
                console.log(err)
                toast.error("Registration failed")
            }

        )

    }


    return(
        <div className="w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center">

            <div className="w-[450px]  backdrop-blur-md shadow-2xl rounded-lg p-6 flex flex-col items-center">

                <img src="logo.png" className="w-[150px] h-[70px] object-cover rounded-lg"/>

                <label className="w-full mt-5 text-lg text-secondary font-semibold">Email</label>

                <input
                value={email}
                onChange={
                    (e)=>{
                        
                        setEmail(e.target.value)

                    }
                }

                type="email" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="user@gmail.com"/>

                <div className="w-full  flex flex-row gap-2">

                    <div className="w-1/2   flex flex-col">

                        <label className="w-full mt-5 text-lg text-secondary font-semibold">First Name</label>
                        <input
                        value={firstName}
                        onChange={
                            (e)=>{
                                setFirstName(e.target.value)
                            }
                        }

                        type="text" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="John"/>


                    </div>
                    <div className="w-1/2 flex flex-col">
                        <label className="w-full mt-5 text-lg text-secondary font-semibold">Last Name</label>
                        <input
                        value={lastName}
                        onChange={
                            (e)=>{
                                setLastName(e.target.value)
                            }
                        }
                        type="text" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="Doe"/>
                    </div>

                </div>

                

                <label className="w-full mt-5 text-lg text-secondary font-semibold">Password</label>
                <input

                value={password}
                onChange={

                    (e)=>{

                        setPassword(e.target.value)

                    }

                }

                type="password" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="••••••••"/>
                
                <label className="w-full mt-5 text-lg text-secondary font-semibold">Confirm Password</label>
                <input

                value={confirmPassword}
                onChange={

                    (e)=>{

                        setConfirmPassword(e.target.value)

                    }

                }

                type="password" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="••••••••"/>
                
                <button onClick={handleRegister} className="w-full h-12 bg-accent rounded-lg text-white font-bold mt-5 ">Register</button>
                <p className="w-full  text-right">Already have an account? register <Link to="/login" className="text-accent font-bold">here</Link></p>

                <button  className="w-full h-12 bg-secondary/20 rounded-lg text-secondary font-bold mt-5 border-2 border-secondary hover:bg-secondary hover:text-white transition-colors flex items-center justify-center gap-2"><FcGoogle /> Register with Google</button>
            </div>

        </div>
    )
}