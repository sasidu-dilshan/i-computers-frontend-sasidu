import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useGoogleLogin } from "@react-oauth/google";
import UserContext from "../context/userContext";

export default function LoginPage(){

    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const userData = useContext(UserContext)

    const googleLogin = useGoogleLogin({
        onSuccess : (response)=>{

            console.log(response)
            console.log(response.access_token)

            api.post("/users/google" , {
                accessToken : response.access_token
            }).then(
                (res)=>{
                    console.log(res)
                    toast.success("Login successful")
                    localStorage.setItem("token" , res.data.token)

                    userData.setUser(res.data.user)

                    if(res.data.isAdmin){
                        navigate("/admin")
                    }else{
                        navigate("/")
                    }

                    

                }
            ).catch(
                (err)=>{
                    console.log(err)
                    toast.error("Google Login failed")
                }
            )

        },
        onError : (error)=>{
            console.log(error)
            toast.error("Google Login failed")
        }
    })

    const navigate = useNavigate()

    function handleLogin(){
        api.post("/users/login" , 
            {
                email : email,
                password : password
            }
        ).then(
            (res)=>{

                toast.success("Login successful")               

                localStorage.setItem("token" , res.data.token)

                userData.setUser(res.data.user)
                
                if(res.data.isAdmin){
                    navigate("/admin" , { replace : true })
                }else{
                    navigate("/")
                }


            }
        ).catch(

            (err)=>{
                console.log(err)
                toast.error("Login failed")
            }

        )

    }


    return(
        <div className="w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center">

            <div className="w-[450px] h-[580px] backdrop-blur-md shadow-2xl rounded-lg p-6 flex flex-col items-center">

                <img src="logo.png" className="w-[150px] h-[70px] object-cover rounded-lg"/>
                <h1 className="text-3xl font-bold text-secondary mt-5">Login</h1>

                <label className="w-full mt-5 text-lg text-secondary font-semibold">Email</label>

                <input
                value={email}
                onChange={
                    (e)=>{
                        
                        setEmail(e.target.value)

                    }
                }

                type="email" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="user@gmail.com"/>

                <label className="w-full mt-5 text-lg text-secondary font-semibold">Password</label>
                <input
                value={password}
                onChange={

                    (e)=>{

                        setPassword(e.target.value)

                    }

                }

                type="password" className="w-full h-12 rounded-lg bg-secondary/20 border-2 border-accent focus:border-accent outline-none px-2 text-secondary" placeholder="••••••••"/>
                <p className="w-full  text-right">Forget Password? reset <Link to="/reset-password" className="text-accent font-bold">here</Link></p>
                
                <button onClick={handleLogin} className="w-full h-12 bg-accent rounded-lg text-white font-bold mt-5 ">Login</button>
                <p className="w-full  text-right">Do not have an account? register <Link to="/register" className="text-accent font-bold">here</Link></p>

                <button  className="w-full h-12 bg-secondary/40 rounded-lg text-black font-bold mt-5 border-2 border-secondary hover:bg-secondary hover:text-white transition-colors flex items-center justify-center gap-2"
                onClick={googleLogin}><FcGoogle /> Login with Google</button>
            </div>

        </div>
    )
}