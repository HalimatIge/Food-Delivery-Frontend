import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    updateQuantity(itemId, quantity);
  };

  const incrementQuantity = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <PageHeader title="My Cart" />
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19.89L18.54 19.34C18.38 20.68 17.23 21.7 15.89 21.7H8.1C6.76 21.7 5.61 20.68 5.46 19.34L4.1 6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 4H15V3H9V4ZM6.23 19.14C6.32 19.94 7 20.55 7.81 20.55H16.19C17 20.55 17.68 19.94 17.77 19.14L19.06 6H4.94L6.23 19.14Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-[#FF4C29] text-white font-medium rounded-lg hover:bg-[#e13b1b] transition-colors duration-200"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </button>
                        </div>
                        
                        <p className="text-[#FF4C29] font-semibold text-sm mt-1">
                          ₦{item.price.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => decrementQuantity(item._id, item.quantity)}
                              disabled={item.quantity <= 1}
                              className={`p-2 ${
                                item.quantity <= 1 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="px-3 py-1 text-sm font-medium min-w-12 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => incrementQuantity(item._id, item.quantity)}
                              className="p-2 text-gray-600 hover:bg-gray-100"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-600 uppercase tracking-wider">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                    {/* Product Info */}
                    <div className="col-span-5 flex items-center gap-4">
                      <img
                        src={item.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="col-span-2 text-center">
                      <span className="text-[#FF4C29] font-semibold">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => decrementQuantity(item._id, item.quantity)}
                            disabled={item.quantity <= 1}
                            className={`p-2 ${
                              item.quantity <= 1 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            className="w-16 px-3 py-2 text-center border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FF4C29] rounded"
                          />
                          
                          <button
                            onClick={() => incrementQuantity(item._id, item.quantity)}
                            className="p-2 text-gray-600 hover:bg-gray-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="col-span-2 text-right">
                      <span className="font-semibold text-gray-800">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <button
                  onClick={clearCart}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200 font-medium"
                >
                  Clear Entire Cart
                </button>
                
                <div className="text-center sm:text-right">
                  <div className="flex items-center gap-4 mb-4 sm:mb-2">
                    <span className="text-lg font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-[#FFD93D]">
                      ₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
                <Link
                  to="/dashboard"
                  className="px-8 py-3 text-center border border-[#FF4C29] text-[#FF4C29] rounded-lg hover:bg-[#FF4C29] hover:text-white transition-colors duration-200 font-medium"
                >
                  Continue Shopping
                </Link>
                
                <Link
                  to="/checkout"
                  className="px-8 py-3 bg-[#FF4C29] text-white text-center rounded-lg hover:bg-[#e13b1b] transition-colors duration-200 font-medium shadow-sm"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;