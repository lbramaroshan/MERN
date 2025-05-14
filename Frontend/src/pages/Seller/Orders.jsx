// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import { useAppContext } from '../../Context/AppContext'
// import toast from 'react-hot-toast';


// const Orders = () => {
//     const { axios } = useAppContext();
//   const [orders, setOrders] = useState([])

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/order/seller')
//       if (data.success) {
//         setOrders(data.orders)
//       }
//     } catch (error) {
//      toast.error(error.message)
//     }
//   };
//   useEffect(() => {
//     fetchOrders()
//   }, []);

//   return (
//     <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
//     <div className="md:p-10  p-4 space-y-4">
//             <h2 className="text-lg font-medium">Orders List</h2>
//             {orders.map((order, index) => (
//                 <div key={index} className="flex  flex-col  md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300 ">
//                     <div className="flex gap-5 max-w-80">
//                         <img className="w-12 h-12 object-cover " src={order.items[0].product.image[0]} alt="boxIcon" />
//                         <div>
//                             {order.items.map((item, index) => (
//                                 <div key={index} className="flex flex-col ">
//                                     <p className="font-medium">
//                                         {item.product.name}{""} <span className='text-primary'>x {item.quantity}</span>
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="text-sm md:text-base text-black/80">
//                         <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>

//                         <p>{order.address.street}, {order.address.city},</p>
//                         <p> {order.address.state},{order.address.zipcode}, {order.address.country}</p>
//                         <p></p>
//                         <p>{order.address.phone}</p>

//                     </div>

//                     <p className="font-medium text-lg my-auto">${order.amount}</p>

//                     <div className="flex flex-col text-sm md:text-base text-black/80">
//                         <p>Method: {order.paymentType}</p>
//                         <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
//                         <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//         </div>
//   )
// }

// export default Orders
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const Orders = () => {
    const { axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/order/seller');
            console.log('Orders data:', data); // Debugging log
            
            if (data?.success) {
                setOrders(Array.isArray(data.orders) ? data.orders : []);
            } else {
                setOrders([]);
                toast.error(data?.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || error.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 h-[95vh] flex items-center justify-center">
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                
                {!orders?.length ? (
                    <p>No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div key={order?._id || Math.random()} className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300">
                            {/* Products Section */}
                            <div className="flex gap-5 max-w-80">
                                {order?.items?.[0]?.product?.image?.[0] ? (
                                    <img 
                                        className="w-12 h-12 object-cover rounded" 
                                        src={order.items[0].product.image[0]} 
                                        alt="product" 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                )}
                                
                                <div className="space-y-1">
                                    {order?.items?.map((item, index) => (
                                        <div key={`${order._id}-item-${index}`}>
                                            <p className="font-medium">
                                                {item?.product?.name || 'Unknown product'}{" "} 
                                                <span className='text-primary'>x {item?.quantity || 1}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${(item?.product?.price * item?.quantity)?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="text-sm md:text-base text-black/80">
                                {order?.address ? (
                                    <>
                                        <p className='font-medium mb-1'>
                                            {order.address.firstName || ''} {order.address.lastName || ''}
                                        </p>
                                        <p>{order.address.street || ''}, {order.address.city || ''},</p>
                                        <p>{order.address.state || ''}, {order.address.zipcode || ''}, {order.address.country || ''}</p>
                                        <p>{order.address.phone || ''}</p>
                                    </>
                                ) : (
                                    <p>No address information</p>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="flex flex-col items-end">
                                <p className="font-medium text-lg">${order?.amount?.toFixed(2) || '0.00'}</p>
                                <div className="flex flex-col text-sm md:text-base text-black/80 mt-2">
                                    <p>Method: {order?.paymentType || 'N/A'}</p>
                                    <p>Date: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                                    <p>Status: {order?.isPaid ? "Paid" : "Pending"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
