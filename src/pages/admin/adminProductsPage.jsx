import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { CiEdit, CiTrash } from "react-icons/ci";
import LoadingAnimation from "../../components/loadingAnimation";
import toast from "react-hot-toast";
import DeleteProductModal from "../../components/deleteProductModal";

export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		api.get("/products").then((response) => {
			if (isLoading) {
				console.log(response.data);
				setProducts(response.data);
				setIsLoading(false);
			}
		});
	}, [isLoading]);

	return (
		<div className="w-full max-h-full  flex flex-col p-4 items-start gap-0 overflow-y-scroll">
		
			<div className="w-full h-[100px] bg-white shadow-md rounded-md flex items-center p-4 justify-between mb-8">
				{isLoading && <LoadingAnimation />}
				<h1 className="text-2xl font-semibold text-secondary">Add Product</h1>

				<div className="flex gap-4 justify-center items-center">
					<span>{products.length} Products</span>
					<button
						onClick={() => {
					
							setIsLoading(true);
						}}
						className="bg-accent text-white px-4 py-2 rounded-md"
					>
						Refresh
					</button>
				</div>
			</div>
		
			<table className="w-full bg-white shadow-md rounded-md overflow-hidden text-center ">
				<thead className="bg-accent text-white h-[60px]">
					<tr>
						<th>Image</th>
						<th>ProductID</th>
						<th>Name</th>
						<th>Price</th>
						<th>Labelled Price</th>
						<th>Stock</th>
						<th>Availability</th>
						<th>Category</th>
						<th>Brand</th>
						<th>Model</th>
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					{products.map((item) => {
						return (
							<tr key={item.productId} className="odd:bg-gray-200">
								<td>
									<img
										src={item.images[0]}
										alt={item.name}
										className="w-[50px] h-[50px] object-cover rounded-md"
									/>
								</td>
								<td>{item.productId}</td>
								<td>{item.name}</td>
								<td>{item.price}</td>
								<td>{item.labelledPrice}</td>
								<td>{item.stock}</td>
								<td>{item.isAvailable ? "Available" : "Not Available"}</td>
								<td>{item.category}</td>
								<td>{item.brand}</td>
								<td>{item.model}</td>
								<td>
									{/* icons only */}
									<div className="flex gap-2 justify-center items-center">
                    {/* navigate("/admin/edit-product" , {state: item}) */}
										<Link
                    state={item}
                    to="/admin/edit-product"><CiEdit /></Link>
								
                    <DeleteProductModal product={item} refresh={()=>{setIsLoading(true)}}/>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<Link
				to="/admin/add-product"
				className="w-[80px] h-[80px] bg-accent text-white rounded-full text-2xl flex justify-center items-center fixed right-[35px] bottom-[35px]"
			>
				<FaPlus />
			</Link>
		</div>
	);
}