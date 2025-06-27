import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Heart, HeartOff, Star } from "lucide-react";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      if (!user) return;
      try {
        const res = await API.get("/wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const isInWishlist = res.data.some(
          (item) => item._id === productId
        );
        setInWishlist(isInWishlist);
      } catch (err) {
        console.error("Failed to check wishlist", err);
      }
    };

    fetchProduct();
    checkWishlist();
  }, [productId, user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return navigate("/login");
    }

    try {
      await API.post(
        "/cart/add",
        { userId: user._id, productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Could not add to cart.");
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return navigate("/login");
    }

    try {
      if (inWishlist) {
        await API.delete(`/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success("Removed from wishlist");
      } else {
        await API.post(
          "/wishlist/add",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Added to wishlist");
      }
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      toast.error("Could not update wishlist");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue");
      return navigate("/login");
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    navigate("/checkout", { state: { product } });
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500 animate-pulse">
        Loading product details...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!product)
    return (
      <div className="text-center mt-10 text-gray-500">
        No product found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-white p-4 border rounded-lg">
          <img
            src={product.image || product.imageUrl || "/placeholder.jpg"}
            alt={product.title}
            className="max-h-[400px] w-auto object-contain"
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
          <p className="text-gray-700">{product.description}</p>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating || 0)
                    ? "fill-yellow-400 stroke-yellow-500"
                    : "stroke-yellow-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Deal & Price */}
          <button className="mt-2 px-4 py-1 text-sm font-semibold text-red-700 bg-red-100 border border-red-400 rounded-full w-fit">
            🔥 Limited Deal
          </button>
          <p className="text-2xl font-semibold text-green-700">
            ₹{product.price}
          </p>

          {/* Info */}
          <p className="text-sm text-gray-600">
            Category: {product.category || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow"
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? (
                <>
                  <Heart className="w-5 h-5 fill-red-500 stroke-red-500" />
                  Remove from Wishlist
                </>
              ) : (
                <>
                  <HeartOff className="w-5 h-5" />
                  Add to Wishlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
