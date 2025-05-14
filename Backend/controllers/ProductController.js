import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/Product.js';

//add product: /api/products/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        await Product.create({...productData, image: imagesUrl });
         res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.log(error.message);
         res.json({ success: false, message: error.message });
    }

}

//get all products: /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//get single product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}





//change product instock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { Id, inStock } = req.body
        await Product.findByIdAndUpdate(Id, { inStock });
        res.json({ success: true, message: "Product stock updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Create a product only for admin

export const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;
  const product = new Product({ name, price, description, category, stock });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};


// http://localhost:5000/api/product/deleteproduct/680350f6a52b1960e21fcffc

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// update product: /api/product/update
export const updateProduct = async (req, res) => {
    try {
        const { id, productData } = req.body;
        await Product.findByIdAndUpdate(id, productData);
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}