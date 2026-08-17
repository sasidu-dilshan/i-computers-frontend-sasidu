import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import LoadingAnimation from "../components/loadingAnimation";
import toast from "react-hot-toast";
import ImageSlideShow from "../components/imageSlideShow";
import { BiCategory } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import getFormattedPrice from "../lib/price-format";
import { addToCart } from "../lib/cart";

export default function ProductOverview(){

    const params = useParams();
    const location = useLocation();
    const [product,setProduct] = useState(location.state);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(
        ()=>{
            if(loading){
                api.get("/products/"+params.productId).then((response)=>{
                    setProduct(response.data);
                    setLoading(false);
                }).catch(()=>{
                    toast.error("Error fetching product details");
                    setProduct(null);
                    setLoading(false);
                })
            }
        }
    )

    return(
        <div className="w-full h-[calc(100vh-100px)] min-h-[calc(100vh-100px)] ">
            {
                loading&&<LoadingAnimation/>
            }
            {
                product!=null&&
                <div className="w-full h-auto pb-[80px] lg:pb-0 lg:h-full lg:min-h-full flex flex-col lg:flex-row bg-primary">
                     <h1 className="lg:hidden text-2xl py-4 px-2 font-semibold">{product.name}
                            {
                                product.altNames.map(
                                    (name , index)=>{
                                        return(
                                            <span key={index} className="font-normal text-gray-500"> | {name}</span>
                                        )
                                    }
                                )
                            }
                        </h1>
                    <div className="lg:w-1/2 lg:h-full flex justify-center items-center">
                        <ImageSlideShow images={product.images}/>
                    </div>
                    <div className="w-full lg:w-1/2 lg:h-full p-8 flex flex-col">
                        <h1 className="hidden lg:block text-3xl font-semibold">{product.name}
                            {
                                product.altNames.map(
                                    (name , index)=>{
                                        return(
                                            <span key={index} className="font-normal text-gray-500"> | {name}</span>
                                        )
                                    }
                                )
                            }
                        </h1>
                        <p className="text-lg text-gray-600 italic">{product.productId}</p>
                        <p className="text-xl  mt-4 font-thin flex items-center"><BiCategory /><span className="mx-2 font-normal">Category</span> <FaAngleRight />  {product.category}</p>
                        <p className="text-xl  mt-4 font-thin flex items-center mb-4"><HiOutlineBadgeCheck /><span className="mx-2 font-normal">{product.brand}</span> <FaAngleRight />  {product.model}</p>
                        {
                            product.labelledPrice>product.price&&
                            <span className="text-lg font-normal line-through text-gray-500">{getFormattedPrice(product.labelledPrice)}</span>
                        }
                        <p className="text-3xl font-semibold text-accent mb-4">{getFormattedPrice(product.price)}</p>
                        <p className="text-lg font-normal text-gray-600 mb-4">{product.description}</p>

                        <div className="w-full  flex ">
                            <button className="w-[200px] h-[60px] bg-white border-2 border-accent text-accent font-semibold rounded-md hover:bg-accent hover:text-white transition-colors duration-300 cursor-pointer"
                            onClick={
                                ()=>{
                                    addToCart(product,1);
                                    toast.success("Product added to cart");
                                }
                            }>Add to Cart</button>

                            <button
                            onClick={
                                ()=>{
                                    navigate("/checkout" , {
                                        state : [
                                            {
                                                product : {
                                                    productId : product.productId,
                                                    name : product.name,
                                                    price : product.price,
                                                    labelledPrice : product.labelledPrice,
                                                    image : product.images[0]
                                                },
                                                qty : 1
                                            }
                                        ]
                                    })
                                }
                            }
                            className="w-[200px] h-[60px] bg-accent border-2 text-white font-semibold rounded-md hover:bg-white hover:text-accent  ml-2 transition-colors duration-300 cursor-pointer flex justify-center items-center">
                                Buy now
                            </button>


                        </div>
                        
                    </div>
                </div>
            }
            {
                product==null&&!loading&&
                <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-3xl font-bold">Product not found</h1>
                </div>
            }
        </div>
    )
}