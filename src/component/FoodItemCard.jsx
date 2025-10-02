import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const FoodItemCard = ({ item }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const isInCart = cartItems.some((cartItem) => cartItem._id === item._id);
  const cartQuantity = cartItems.find(cartItem => cartItem._id === item._id)?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item._id);
    toast.info(`${item.name} removed from cart`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Food Image */}
      <div className="relative pb-[75%] overflow-hidden">
        <img
          src={item.images?.[0]?.url || "/placeholder-food.jpg"}
          alt={item.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
        />
        {item.isPopular && (
          <div className="absolute top-2 left-2 bg-[#FF4C29] text-white text-xs font-bold px-2 py-1 rounded-full">
            Popular
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-[#FF4C29] font-semibold">₦{item.price.toFixed(2)}</p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Nutrition Info (optional) */}
        {item.calories && (
          <div className="text-xs text-gray-500 mb-4">
            <span>{item.calories} cal</span>
            {item.dietaryTags?.length > 0 && (
              <span className="ml-2">• {item.dietaryTags.join(", ")}</span>
            )}
          </div>
        )}

        {/* Cart Actions */}
        <div className="mt-auto">
          {isInCart ? (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleRemoveFromCart}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors"
                aria-label={`Remove ${item.name} from cart`}
              >
                −
              </button>
              <span className="font-medium">{cartQuantity}</span>
              <button
                onClick={handleAddToCart}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors"
                aria-label={`Add more ${item.name} to cart`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF4C29] hover:bg-[#E04427] text-white font-medium py-2 px-4 rounded-lg transition-colors"
              aria-label={`Add ${item.name} to cart`}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
