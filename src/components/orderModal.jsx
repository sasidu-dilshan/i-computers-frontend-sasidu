import { useContext, useState } from 'react';
import Modal from 'react-modal';
import { getCartTotal } from '../lib/cart';
import getFormattedPrice from '../lib/price-format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import uploadMedia from '../lib/uploadMedia';
import UserContext from '../context/userContext';
export default function OrderModal(props){
    const userData = useContext(UserContext)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [firstName, setFirstName] = useState(userData.user?.firstName ||"")
    const [lastName, setLastName] = useState(userData.user?.lastName ||"")
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("")
    const [specialNotes, setSpecialNotes] = useState("")
    // const [file, setFile] = useState(null)
    const navigate = useNavigate()


    async function handleConfirmOrder(){
        const token = localStorage.getItem("token")
        if(!token){
            toast.error("Please login to place an order")
            navigate("/login")
            return
        }

        const orderData = {
            firstName : firstName,
            lastName : lastName,
            addressLine1 : addressLine1,
            addressLine2 : addressLine2,
            city : city,
            postalCode : postalCode,
            phone : phoneNumber,
            secondaryPhone : secondaryPhoneNumber,
            customerNotes : specialNotes,
            items : []
        }
        
        for(let i=0; i<props.cart.length; i++){

            orderData.items.push({
                productId : props.cart[i].product.productId,
                qty : props.cart[i].qty
            })

        }

        try{

            await api.post("/orders", orderData, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })

            toast.success("Order placed successfully")
            setModalIsOpen(false)
            navigate("/products")

        }catch(err){
            console.log(err)
            toast.error("Failed to place order")
        }
       
    }

    return(

        <>
            <button
            onClick={()=>{setModalIsOpen(true)}}
            className="bg-accent/75 hover:bg-accent cursor-pointer transition-colors duration-300 text-white px-4 py-2 rounded-md font-semibold">
                        Order
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={()=>{setModalIsOpen(false)}}
                style={ 
                    {
                        content : {
                            margin : 'auto',
                            padding : '0px',
                            paddingBottom : '0px',
                            backgroundColor : 'transparent',
                            border : 'none'
                        }
                    }
                }
            >
                <div className='w-full min-h-full bg-primary rounded-2xl flex flex-col z-50'>
                    <div className='w-full h-[70px] bg-accent rounded-t-2xl flex'>
                            {/*  order summary*/}
                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                <h1 className='text-xl font-semibold text-white'>Order Summary</h1>
                            </div>
                    </div>
                    {/* total */}
                    <div className='w-full h-[70px] bg-[#7979b8]  flex sticky top-0'>
                            <div className='w-1/2 h-full  flex flex-row justify-center items-center gap-2'>
                                <h1 className='text-lg font-semibold text-white'>Total : </h1>
                                <span className='text-lg font-semibold text-white'>{getFormattedPrice(getCartTotal(props.cart))}</span>                            
                            </div>
                            <div className='w-1/2 h-full  flex flex-row justify-center items-center gap-2'>
                                <h1 className='text-lg font-semibold text-white'>Items : </h1>
                                <span className='text-lg font-semibold text-white'>{props.cart.length}</span>
                            </div>                           
                    </div>
                        <div className='w-full  flex flex-row flex-wrap text-secondary'>                            
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">First Name</label>
                                <input
                                value={firstName}
                                onChange={(e)=>{setFirstName(e.target.value)}}
                                placeholder='John'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">Last Name</label>
                                <input
                                value={lastName}
                                onChange={(e)=>{setLastName(e.target.value)}}
                                placeholder='Doe'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-full h-[100px] flex flex-col justify-center p-4'>
                                <label className="">Address Line 1</label>
                                <input
                                value={addressLine1}
                                onChange={(e)=>{setAddressLine1(e.target.value)}}
                                placeholder='123 Main St'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-full h-[100px] flex flex-col justify-center p-4'>
                                <label className="">Address Line 2</label>
                                <input
                                value={addressLine2}
                                onChange={(e)=>{setAddressLine2(e.target.value)}}
                                placeholder='Apt 4B'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">City</label>
                                <input
                                value={city}
                                onChange={(e)=>{setCity(e.target.value)}}
                                placeholder='Colombo'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">Postal Code</label>
                                <input
                                value={postalCode}
                                onChange={(e)=>{setPostalCode(e.target.value)}}
                                placeholder='12345'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">Phone</label>
                                <input
                                value={phoneNumber}
                                onChange={(e)=>{setPhoneNumber(e.target.value)}}
                                placeholder='+94 123 456 789'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                            <div className='w-1/2 h-[100px]  flex flex-col justify-center p-4'>
                                <label className="">Secondary Phone</label>
                                <input
                                value={secondaryPhoneNumber}
                                onChange={(e)=>{setSecondaryPhoneNumber(e.target.value)}}
                                placeholder='+94 987 654 321'
                                className='w-full h-[40px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>
                           
                            
                            <div className='w-full h-[150px] flex flex-col justify-center p-4'>
                                <label className="">Special Notes</label>
                                <textarea
                                value={specialNotes}
                                onChange={(e)=>{setSpecialNotes(e.target.value)}}
                                placeholder='Any special instructions for delivery...'
                                className='w-full h-[100px] rounded-md outline-0 border-gray-500 border px-2 text-black'
                                />
                            </div>

                            <div className='w-full sticky bottom-0 h-[70px] bg-[#7979b8] rounded-b-2xl flex flex-row justify-center items-center gap-2 z-50 mb-[80px] lg:mb-0'>
                                <button
                                onClick={handleConfirmOrder}
                                className='bg-accent/75 hover:bg-accent cursor-pointer transition-colors duration-300 text-white px-4 py-2 rounded-md font-semibold'>
                                    Confirm Order
                                </button>

                                {/* cancel */}
                                <button
                                onClick={()=>{
                                    setModalIsOpen(false)
                                }}
                                className='bg-gray-500/75 hover:bg-gray-500 cursor-pointer transition-colors duration-300 text-white px-4 py-2 rounded-md font-semibold'>
                                    Cancel
                                </button>             

                            </div>

                        </div>
                
                </div>
                
            </Modal>
        </>

    )
}