const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getProducts, topProducts } = require("../controllers/productController");
const {createCategory, getCategories} = require("../controllers/categoryController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/productos").get(getProducts);
//Most selling by stock
router.route("/productos/top-5").get(topProducts, getProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

//Category
router.route("/category/").get(getCategories);
router.route("/admin/category/new").post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);


module.exports = router; 