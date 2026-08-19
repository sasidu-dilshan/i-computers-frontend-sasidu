import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadMedia from "../../lib/uploadMedia";
import { CiCircleInfo } from "react-icons/ci";
import { FiPackage, FiUploadCloud, FiSave, FiX, FiTag, FiLayers, FiDollarSign } from "react-icons/fi";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";

export default function EditProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const [productId, setProductId] = useState(location?.state?.productId || "");
  const [name, setName] = useState(location?.state?.name || "");
  const [altNames, setAltNames] = useState(location?.state?.altNames?.join(",") || "");
  const [description, setDescription] = useState(location?.state?.description || "");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(location?.state?.price || "");
  const [labelledPrice, setLabelledPrice] = useState(location?.state?.labelledPrice || "");
  const [stock, setStock] = useState(location?.state?.stock || "");
  const [isAvailable, setIsAvailable] = useState(location?.state?.isAvailable ?? true);
  const [category, setCategory] = useState(location?.state?.category || "Laptop");
  const [brand, setBrand] = useState(location?.state?.brand || "");
  const [model, setModel] = useState(location?.state?.model || "");
  const [loading, setLoading] = useState(false);

  const getFormattedPrice = (amount) => {
    if (!amount || isNaN(amount)) return "0.00";
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (!location.state) {
      toast.error("No product data found");
      navigate("/admin/products");
    }
  }, [location.state, navigate]);

  async function handleUpdate() {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
      return;
    }

    const productData = {
      productId: productId,
      name: name,
      altNames: [],
      description: description,
      images: [],
      price: price,
      labelledPrice: labelledPrice,
      stock: stock,
      isAvailable: isAvailable,
      category: category,
      brand: brand,
      model: model,
    };

    try {
      const imageUploadPromises = [];

      for (let i = 0; i < images.length; i++) {
        imageUploadPromises[i] = uploadMedia(images[i]);
      }

      const uploadedImagesUrls = await Promise.all(imageUploadPromises);

      if (uploadedImagesUrls.length > 0) {
        productData.images = uploadedImagesUrls;
      } else {
        productData.images = location?.state?.images || [];
      }

      productData.altNames = altNames.split(",");

      const res = await api.put("/products/" + productId, productData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(res);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update product");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {loading && <LoadingAnimation />}

      <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <FiPackage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Edit Product
            </h1>
            <p className="text-xs text-slate-400">Modify details and update product specifications</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all duration-200 hover:border-slate-600"
          >
            <FiX className="w-4 h-4" />
            Cancel
          </Link>
          <button
            onClick={handleUpdate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiSave className="w-4 h-4" />
            Update Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 flex flex-col gap-6">

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col gap-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm border-b border-slate-800 pb-3">
              <FiTag className="w-4 h-4" /> Basic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              <div className="md:col-span-4 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product ID</label>
                <input
                  disabled
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 text-sm cursor-not-allowed font-mono"
                />
              </div>

              <div className="md:col-span-8 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 Max"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-12 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alternative Names</label>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <CiCircleInfo className="text-indigo-400" /> Separated by commas
                  </span>
                </div>
                <input
                  type="text"
                  value={altNames}
                  onChange={(e) => setAltNames(e.target.value)}
                  placeholder="e.g. Apple Laptop, Pro 16 Inch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-12 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a clear description of the product..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <FiUploadCloud className="w-4 h-4" /> Media & Assets
              </div>
              {images.length > 0 && (
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
                  {images.length} new files selected
                </span>
              )}
            </div>

            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 bg-slate-950/40 text-center flex flex-col items-center justify-center gap-3 group">
              <div className="p-3 bg-slate-900 rounded-full border border-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-200">
                <FiUploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Click or drag files to replace images</p>
                <p className="text-xs text-slate-500 mt-1">Leave empty to keep original images</p>
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col gap-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm border-b border-slate-800 pb-3">
              Pricing & Stock
            </div>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selling Price</label>
                  <span className="text-xs text-indigo-400 font-mono">
                    LKR {getFormattedPrice(price)}
                  </span>
                </div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Labelled Price</label>
                  <span className="text-xs text-slate-400 font-mono line-through">
                    LKR {getFormattedPrice(labelledPrice)}
                  </span>
                </div>
                <input
                  type="number"
                  value={labelledPrice}
                  onChange={(e) => setLabelledPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Quantity</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Availability Status</label>
                <select
                  value={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 flex flex-col gap-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm border-b border-slate-800 pb-3">
              <FiLayers className="w-4 h-4" /> Category & Specifications
            </div>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Graphics Card">Graphics Card</option>
                  <option value="Processor">Processor</option>
                  <option value="Motherboard">Motherboard</option>
                  <option value="Power Supply">Power Supply</option>
                  <option value="RAM">RAM</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, ASUS, Dell"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. M3 Pro 2024"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}