// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/appContext";

// const MyOrders = () => {
//   const [myOrders, setMyOrders] = useState([]);
//   const {user, axios} = useAppContext();

//   const fetchMyOrders = async () => {
//   try {
//     const {data} = await axios.get('/apo/order/user')
//     if(data.success){
//       setMyOrders(data.orders)
//     }
//   } catch (error) {
//     console.log(error);
    
//   }
//   };

//   useEffect(() => {
//     if (!user){
//       fetchMyOrders();
//     }
   
//   }, [user]);

//   return (
//     <div className="mt-16 pb-16">
//       <div className="flex flex-col items-end w-max mb-8">
//         <p className="text-2xl font-medium uppercase">My Orders</p>
//         <div className="w-16 h-0.5 bg-primary rounded-full"></div>
//       </div>

//       {myOrders.length > 0 ? (
//         myOrders.map((order, index) => (
//           <div
//             key={index}
//             className="border border-gray-300 rounded-lg p-4 mb-10 py-5 max-w-4xl"
//           >
//             <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
//               <span>OrderId: {order._id}</span>
//               <span>Payment: {order.paymentType}</span>
//               <span>TotalAmount: $ {order.amount}</span>
//             </p>

//             {order.items.map((item, Index) => (
//               <div
//                 key={Index}
//                 className={`relative bg-white text-gray-500/70 ${
//                   order.items.length !== index + 1 && "border-b"
//                 }border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
//               >
//                 <div className="flex  mb-4 items-center md:mb-0">
//                   <div className="bg-primary/10 p-4 rounded-lg">
//                     <img
//                       src={item.product.image[0]}
//                       alt={item.product.name}
//                       className="w-16 h-16"
//                     />
//                   </div>
//                   <div className="ml-4">
//                     <h2 className="text-xl font-medium text-gray-800">
//                       {item.product.name}
//                     </h2>
//                     <p className="text-gray-500">
//                       Category: {item.product.category}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="text-primary text-lg font-medium">
//                   <p>Quantity: {item.quantity || "1"}</p>
//                   <p>Status: {order.status || "Processing"}</p>
//                   <p>
//                     Date:{" "}
//                     {order.createdAt
//                       ? new Date(order.createdAt).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>
//                 <p className="text-primary text-lg font-medium">
//                   Amount: ${item.product.offerPrice * item.quantity}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No orders found</p>
//       )}
//     </div>
//   );
// };

// export default MyOrders;





import React, { useState, useEffect } from "react";
import { useAppContext } from "../Context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const {  user, axios } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/order/user'); // Fixed typo in endpoint ('apo' -> 'api')
      if (data.success) {
        setMyOrders(data.orders || []); // Ensure we always have an array
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) { // Changed condition to fetch when user exists
      fetchMyOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="mt-16 pb-16 flex justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.length > 0 ? (
        myOrders.map((order, orderIndex) => (
          <div
            key={order._id || orderIndex}
            className="border border-gray-300 rounded-lg p-4 mb-10 py-5 max-w-4xl"
          >
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>OrderId: {order._id || "N/A"}</span>
              <span>Payment: {order.paymentMethod || "N/A"}</span>
              <span>TotalAmount: $ {order.totalAmount || "0.00"}</span>
            </p>

            {order.items?.map((item, itemIndex) => {
              const product = item.products || item.product || {}; // Handle both naming conventions
              const price = product.offerPrice || product.price || 0;
              const quantity = item.quantity || 1;
              
              return (
                <div
                  key={itemIndex}
                  className={`relative bg-white text-gray-500/70 ${
                    order.items.length !== itemIndex + 1 && "border-b"
                  } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                >
                  <div className="flex mb-4 items-center md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <img
                        src={product.image?.[0] || "/placeholder-image.png"}
                        alt={product.name || "Product"}
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-800">
                        {product.name || "Unknown Product"}
                      </h2>
                      <p className="text-gray-500">
                        Category: {product.category || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="text-primary text-lg font-medium">
                    <p>Quantity: {quantity}</p>
                    <p>Status: {order.status || "Processing"}</p>
                    <p>
                      Date:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <p className="text-primary text-lg font-medium">
                    Amount: ${(price * quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <p className="text-gray-500">
            {user ? "No orders found" : "Please login to view your orders"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
