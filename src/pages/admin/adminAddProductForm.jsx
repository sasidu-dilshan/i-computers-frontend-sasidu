import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import uploadMedia from "../../lib/uploadMedia";
import { 
  FiPackage, 
  FiSave, 
  FiX, 
  FiUploadCloud, 
  FiDollarSign, 
  FiLayers, 
  FiInfo 
} from "react-icons/fi";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadingAnimation";

export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [labelledPrice, setLabelledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [category, setCategory] = useState("Laptop");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSave() {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token == null) {
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
      model: model
    };

    try {
      const imageUploadPromises = [];

      for (let i = 0; i < images.length; i++) {
        imageUploadPromises[i] = uploadMedia(images[i]);
      }

      console.log(imageUploadPromises);

      productData.images = await Promise.all(imageUploadPromises);
      productData.altNames = altNames ? altNames.split(",") : [];

      const res = await api.post("/products", productData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      console.log(res);
      toast.success("Product added successfully");
      navigate("/admin/products");

    } catch (err) {
      console.log(err);
      toast.error("Failed to add product");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 font-sans overflow-y-auto">
      {loading && <LoadingAnimation />}

      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <FiPackage className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Add New Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Create and publish a new item to your store inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <FiX className="text-base" />
            <span>Cancel</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-base" />
            <span>Save Product</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <FiLayers /> General Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="e.g. LAP-001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ASUS ROG Strix Scar 16"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  Alternative Names
                  <span className="text-slate-500 text-[11px] font-normal lowercase">(search tags)</span>
                </span>
                <span className="text-[11px] text-cyan-400/80 flex items-center gap-1">
                  <FiInfo /> Comma-separated
                </span>
              </label>
              <input
                type="text"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
                placeholder="gaming laptop, asus laptop, scar 16"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a detailed product description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-y min-h-[120px]"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <FiDollarSign /> Pricing & Stock
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Labelled Price
                </label>
                <input
                  type="number"
                  value={labelledPrice}
                  onChange={(e) => setLabelledPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Stock Count
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Availability
                </label>
                <select
                  value={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <FiLayers /> Category & Brand
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. ASUS, MSI, Intel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. G634JYR"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="text-xs font-semibold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <FiUploadCloud /> Product Images
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
                Upload Media Files
              </label>

              <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 text-center bg-slate-950/50 transition-colors group cursor-pointer">
                <input
                  type="file"
                  multiple={true}
                  onChange={(e) => setImages(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <FiUploadCloud className="text-2xl" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-[11px] text-slate-500">
                    PNG, JPG, WEBP formats supported
                  </p>
                  {images && images.length > 0 && (
                    <div className="mt-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                      {images.length} image(s) selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}