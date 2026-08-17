import { BsBox, BsCart2 } from "react-icons/bs";
import { LuUsersRound } from "react-icons/lu";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductsPage";
import AddProductForm from "./admin/adminAddProductForm";
import EditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";
import { useContext, useEffect } from "react";
import UserContext from "../context/userContext";



export default function AdminPage(){

    const userData = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userData.user || !userData.user.isAdmin){
            navigate("/login");
        }
    }, [userData, navigate]);

    return(
        <div className="w-full h-full flex text-secondary">

            <div className="w-[360px] h-full shadow-2xl   flex flex-col">
                <div className="w-full h-[60px] p-2 flex gap-2 items-end mb-2">
                    <img src="/logo.png" alt="logo" className=" h-full " />
                    <span className="text-2xl font-bold">Admin </span>
                </div>
                <Link to="/admin" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><BsCart2 className="text-3xl" /> Orders</Link>
                <Link to="/admin/products" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><BsBox className="text-3xl" /> Products</Link>
                <Link to="/admin/users" className="w-full flex items-center p-2 text-xl gap-2 mb-2 hover:bg-accent hover:text-white"><LuUsersRound className="text-3xl" /> Users</Link>
            </div>
            <div className="w-[calc(100%-360px)]  h-full bg-primary">

                <Routes>
                    <Route path="/" element={<AdminOrdersPage />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<AdminUsersPage/>} />
                    <Route path="/add-product" element={<AddProductForm/>}/>
                    <Route path="/edit-product" element={<EditProductForm/>}/>
                </Routes>

            </div>
        </div>
    )
}