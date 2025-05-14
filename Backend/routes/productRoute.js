import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList, deleteProduct, updateProduct, createProduct } from '../controllers/ProductController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), authSeller, addProduct); // add product
productRouter.get('/list', productList); // get all products
productRouter.get('/id', productById); // get single product
productRouter.post('/stock', authSeller, changeStock); // change
productRouter.delete('/delete/:id', deleteProduct); // delete product
productRouter.post('/create', upload.array('images'), createProduct);
productRouter.put('/update', upload.array('images'), updateProduct); // update product



export default productRouter;
