import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaPlus,
  FaTrash,
  FaSyncAlt,
  FaCalendarAlt,
  FaBox,
  FaRupeeSign,
} from "react-icons/fa";

import API from "../services/api";
import "../styles/Sales.css";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    quantity: 1,
    sale_date: new Date().toISOString().split("T")[0],
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD SALES + PRODUCTS
  // =========================================================
  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [salesResponse, productsResponse] =
        await Promise.all([
          API.get("/sales"),
          API.get("/products"),
        ]);

      // -------------------------------------------------------
      // SALES RESPONSE
      // -------------------------------------------------------
      let salesData = [];

      if (Array.isArray(salesResponse.data)) {
        salesData = salesResponse.data;
      } else if (
        salesResponse.data &&
        Array.isArray(salesResponse.data.sales)
      ) {
        salesData = salesResponse.data.sales;
      }

      // -------------------------------------------------------
      // PRODUCTS RESPONSE
      // Supports:
      // 1. [product1, product2]
      // 2. { products: [product1, product2] }
      // -------------------------------------------------------
      let productsData = [];

      if (Array.isArray(productsResponse.data)) {
        productsData = productsResponse.data;
      } else if (
        productsResponse.data &&
        Array.isArray(productsResponse.data.products)
      ) {
        productsData = productsResponse.data.products;
      }

      // -------------------------------------------------------
      // NORMALIZE PRODUCT DATA
      // -------------------------------------------------------
      productsData = productsData.map((product) => ({
        id: product.id,
        product_name:
          product.product_name ||
          product.name ||
          "Unnamed Product",
        category: product.category || "Other",
        price: Number(product.price || 0),
        stock: Number(
          product.stock ??
            product.stock_quantity ??
            0
        ),
      }));

      setSales(salesData);
      setProducts(productsData);

      console.log("=================================");
      console.log("SALES API RESPONSE:");
      console.log(salesResponse.data);

      console.log("PRODUCTS API RESPONSE:");
      console.log(productsResponse.data);

      console.log("FINAL PRODUCTS LIST:");
      console.table(productsData);

      console.log("TOTAL PRODUCTS:", productsData.length);
      console.log("=================================");
    } catch (error) {
      console.error("Load data error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load sales data. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (name === "product_id") {
      const product = products.find(
        (item) =>
          String(item.id) === String(value)
      );

      setSelectedProduct(product || null);

      console.log("Selected Product:", product);
    }
  };

  // =========================================================
  // TOTAL AMOUNT
  // =========================================================
  const totalAmount =
    selectedProduct && form.quantity
      ? Number(selectedProduct.price || 0) *
        Number(form.quantity || 0)
      : 0;

  // =========================================================
  // ADD SALE
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Product validation
    if (!form.product_id) {
      setMessage("Please select a product.");
      return;
    }

    // Quantity validation
    if (
      !form.quantity ||
      Number(form.quantity) <= 0
    ) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    // Date validation
    if (!form.sale_date) {
      setMessage("Please select a sale date.");
      return;
    }

    // Product validation
    if (!selectedProduct) {
      setMessage("Selected product was not found.");
      return;
    }

    const quantity = Number(form.quantity);

    const availableStock = Number(
      selectedProduct.stock || 0
    );

    // Stock validation
    if (quantity > availableStock) {
      setMessage(
        `Only ${availableStock} items available in stock.`
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/sales", {
        product_id: Number(form.product_id),
        quantity: quantity,
        total_amount: totalAmount,
        sale_date: form.sale_date,
      });

      console.log("Sale added:", response.data);

      setMessage("Sale added successfully.");

      // Reset form
      setForm({
        product_id: "",
        quantity: 1,
        sale_date:
          new Date()
            .toISOString()
            .split("T")[0],
      });

      setSelectedProduct(null);

      // Reload sales and products
      await loadData();
    } catch (error) {
      console.error("Add sale error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to add sale. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE SALE
  // =========================================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.delete(`/sales/${id}`);

      setMessage("Sale deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete sale error:", error);

      setMessage(
        error.response?.data?.message ||
          "Delete failed. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FIND PRODUCT NAME
  // =========================================================
  const getProductName = (sale) => {
    // First use product_name from backend
    if (
      sale.product_name &&
      typeof sale.product_name === "string"
    ) {
      const cleanName =
        sale.product_name.trim();

      if (
        cleanName &&
        cleanName.toLowerCase() !==
          "undefined"
      ) {
        return cleanName;
      }
    }

    // Try product field
    if (
      sale.product &&
      typeof sale.product === "string"
    ) {
      const cleanProduct =
        sale.product.trim();

      if (
        cleanProduct &&
        cleanProduct.toLowerCase() !==
          "undefined"
      ) {
        return cleanProduct;
      }
    }

    // Find product from products list
    const matchingProduct =
      products.find(
        (product) =>
          String(product.id) ===
          String(sale.product_id)
      );

    if (matchingProduct?.product_name) {
      return matchingProduct.product_name;
    }

    return `Product ${
      sale.product_id || "-"
    }`;
  };

  // =========================================================
  // TOTAL SALES
  // =========================================================
  const totalSales = sales.reduce(
    (sum, sale) =>
      sum +
      Number(sale.total_amount || 0),
    0
  );

  // =========================================================
  // TOTAL QUANTITY
  // =========================================================
  const totalQuantity = sales.reduce(
    (sum, sale) =>
      sum +
      Number(sale.quantity || 0),
    0
  );

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================
  const formatAmount = (amount) => {
    return Number(amount || 0).toFixed(2);
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="sales-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="sales-header">

        <div className="sales-title-row">

          <div className="sales-icon">
            <FaShoppingCart />
          </div>

          <div>
            <h1>Sales Management</h1>

            <p>
              Record and monitor your business sales
            </p>
          </div>

        </div>

        <button
          className="refresh-btn"
          onClick={loadData}
          disabled={loading}
        >
          <FaSyncAlt />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}
      {message && (
        <div className="sales-message">
          {message}
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="sales-summary">

        {/* TOTAL SALES */}
        <div className="sales-summary-card">

          <div className="summary-icon">
            <FaRupeeSign />
          </div>

          <div>
            <span>Total Sales</span>

            <h2>
              ₹{formatAmount(totalSales)}
            </h2>
          </div>

        </div>

        {/* TRANSACTIONS */}
        <div className="sales-summary-card">

          <div className="summary-icon">
            <FaShoppingCart />
          </div>

          <div>
            <span>Total Transactions</span>

            <h2>
              {sales.length}
            </h2>
          </div>

        </div>

        {/* ITEMS SOLD */}
        <div className="sales-summary-card">

          <div className="summary-icon">
            <FaBox />
          </div>

          <div>
            <span>Items Sold</span>

            <h2>
              {totalQuantity}
            </h2>
          </div>

        </div>

      </div>

      {/* =====================================================
          ADD NEW SALE
      ===================================================== */}
      <div className="sales-card">

        <div className="card-heading">

          <div>

            <h2>Add New Sale</h2>

            <p>
              Enter the details of your latest transaction
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="sale-form"
        >

          {/* PRODUCT */}
          <div className="form-group">

            <label>
              <FaBox />
              Product
            </label>

            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Product
              </option>

              {products.length > 0 ? (
                products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >

                    {product.product_name}

                    {" — ₹"}

                    {Number(
                      product.price || 0
                    ).toFixed(2)}

                    {" | Stock: "}

                    {product.stock}

                  </option>

                ))
              ) : (

                <option value="" disabled>
                  No products available
                </option>

              )}

            </select>

            {/* PRODUCT COUNT */}
            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#777",
              }}
            >
              {products.length} product
              {products.length !== 1
                ? "s"
                : ""} available
            </small>

          </div>

          {/* SELECTED PRODUCT INFO */}
          {selectedProduct && (
            <div
              className="selected-product-info"
              style={{
                padding: "12px 15px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#f5f7fa",
                border: "1px solid #e5e7eb",
              }}
            >

              <strong>
                {selectedProduct.product_name}
              </strong>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                Price: ₹
                {Number(
                  selectedProduct.price || 0
                ).toFixed(2)}
                {" | "}
                Available Stock:{" "}
                {selectedProduct.stock}
              </div>

            </div>
          )}

          {/* QUANTITY */}
          <div className="form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              min="1"
              max={
                selectedProduct
                  ? selectedProduct.stock
                  : undefined
              }
              value={form.quantity}
              onChange={handleChange}
              required
            />

          </div>

          {/* DATE */}
          <div className="form-group">

            <label>
              <FaCalendarAlt />
              Sale Date
            </label>

            <input
              type="date"
              name="sale_date"
              value={form.sale_date}
              onChange={handleChange}
              required
            />

          </div>

          {/* TOTAL */}
          <div className="total-box">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{formatAmount(totalAmount)}
            </strong>

          </div>

          {/* ADD BUTTON */}
          <button
            type="submit"
            className="add-sale-btn"
            disabled={
              loading ||
              !selectedProduct
            }
          >

            <FaPlus />

            {loading
              ? "Adding..."
              : "Add Sale"}

          </button>

        </form>

      </div>

      {/* =====================================================
          SALES HISTORY
      ===================================================== */}
      <div className="sales-card">

        <div className="card-heading table-heading">

          <div>

            <h2>
              Sales History
            </h2>

            <p>
              View all recorded sales transactions
            </p>

          </div>

          <span className="transaction-count">
            {sales.length} Transactions
          </span>

        </div>

        {/* LOADING */}
        {loading && sales.length === 0 ? (

          <div className="empty-sales">
            Loading sales...
          </div>

        ) : sales.length === 0 ? (

          /* EMPTY */
          <div className="empty-sales">

            <FaShoppingCart />

            <h3>
              No sales recorded yet
            </h3>

            <p>
              Add your first sale using the form above.
            </p>

          </div>

        ) : (

          /* TABLE */
          <div className="table-container">

            <table className="sales-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Sale Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {sales.map((sale) => (

                  <tr key={sale.id}>

                    {/* ID */}
                    <td>
                      #{sale.id}
                    </td>

                    {/* PRODUCT */}
                    <td>

                      <div className="product-name">

                        <span className="product-table-icon">
                          <FaBox />
                        </span>

                        <span>
                          {getProductName(sale)}
                        </span>

                      </div>

                    </td>

                    {/* QUANTITY */}
                    <td>
                      {Number(
                        sale.quantity || 0
                      )}
                    </td>

                    {/* TOTAL */}
                    <td className="amount">

                      ₹
                      {formatAmount(
                        sale.total_amount
                      )}

                    </td>

                    {/* DATE */}
                    <td>
                      {sale.sale_date || "-"}
                    </td>

                    {/* DELETE */}
                    <td>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            sale.id
                          )
                        }
                        title="Delete sale"
                      >

                        <FaTrash />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Sales;