import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function DeleteProductModal(props){

    const [showModal , setShowModal] = useState(false)
    const refresh = props.refresh
    const product = props.product

    async function handleDelete(){
	  const token = localStorage.getItem("token");

	  

	  try{
	    await api.delete(`/products/${product.productId}`, {
	      headers: {
	        Authorization: `Bearer ${token}`
	      }
	    });
	    toast.success("Product deleted successfully");
	    refresh()
	  }catch(error){
	    console.log(error);
	  }finally{
        setShowModal(false);
      }

	}

    return(
        <>
            <CiTrash
                onClick={() => setShowModal(true)}
                className="hover:text-red-600 cursor-pointer"/>
            {showModal&&<div className="w-screen h-screen bg-black/50 flex justify-center items-center fixed left-0 top-0">

                <div className="w-[400px] h-[200px] bg-white rounded-md shadow-md flex flex-col items-center justify-between gap-4 ">

                    <div className="w-full h-[40px] bg-accent rounded-t-md flex items-center justify-between text-white">
                        <h1 className="px-2">Delete Confimation</h1>
                        <button onClick={() => setShowModal(false)} className="p-2 hover:text-red-600 cursor-pointer">X</button>
                        
                    </div>
                    <p className="px-2">Are you sure you want to delete this product with ID {product.productId}?</p>
                    <div className="flex gap-2 pb-2">
                        <button className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => setShowModal(false)}>Cancel</button>
                        <button onClick={handleDelete} className="p-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700">
                            Confirm
                        </button>
                    </div>
                </div>
                
            </div>}
        </>
    )
}