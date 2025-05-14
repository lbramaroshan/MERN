import Order from "../models/Order.js";
import Product from "../models/Product.js";
// import Stripe from "stripe";

//place order cod :/api/order/COD
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address, totalAmount } = req.body;

        if (!userId) {
            return res.json({ success: false, message: 'User id is required' })
        }

        if (!address) {
            return res.json({ success: false, message: 'invalid data' })
        }

        await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentType: "COD"
        });

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//place Order stripe :/api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'invalid data' })
        }

        let productData = [];
        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        //add tax charge 2%
        amount += Math.floor(amount * 0.02);
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "online"
        });

        // stripe gateway initialization
        // Uncomment and implement Stripe when ready
        /*
        const stripe = new Stripe(process.env.STRIPE_KEY);
        // create line items
        const line_Items = productData.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            };
        })

        // create session 
        const session = await stripe.checkout.sessions.create({
            line_items: line_Items,
            mode: "payment",
            success_url: `${origin}/loader?next=myorders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId
            }
        })
        */

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//get orders by user id :/api/order/user
export const getUserOrders = async (req, res) => {

    try {
      
        const orders = await Order.find({
            userId:req.userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        console.log(orders);
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//get all order for seller / admin :/api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
