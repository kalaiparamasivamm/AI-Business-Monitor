import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [message, setMessage] = useState("");

  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {
    try {
      const response = await api.get("/products");

      // Backend returns either objects or old array format
      const formattedProducts = response.data.map((product) => {
        if (Array.isArray(product)) {
          return {
            id: product[0],
            product_name: product[1],
            category: product[2],
            price: product[3],
            stock: product[4],
          };
        }

        return product;
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.log(error);
      setMessage("Failed to load products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async () => {
    if (!productName || !category || !price || !stock) {
      setMessage("Please fill all fields");
      return;
    }

    if (Number(price) <= 0 || Number(stock) < 0) {
      setMessage("Enter valid price and stock");
      return;
    }

    try {
      const response = await api.post("/products", {
        product_name: productName,
        category: category,
        price: Number(price),
        stock: Number(stock),
      });

      setMessage(response.data.message);

      setProductName("");
      setCategory("");
      setPrice("");
      setStock("");

      getProducts();
    } catch (error) {
      console.log(error);

      if (error.response) {
        setMessage(
          error.response.data.message || "Failed to add product"
        );
      } else {
        setMessage("Failed to add product");
      }
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const updateProduct = async (id) => {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    const newPrice = prompt(
      "Enter new price:",
      product.price
    );

    if (newPrice === null) return;

    const newStock = prompt(
      "Enter new stock:",
      product.stock
    );

    if (newStock === null) return;

    if (Number(newPrice) <= 0 || Number(newStock) < 0) {
      setMessage("Enter valid price and stock");
      return;
    }

    try {
      const response = await api.put(`/products/${id}`, {
        price: Number(newPrice),
        stock: Number(newStock),
      });

      setMessage(response.data.message);

      getProducts();
    } catch (error) {
      console.log(error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "Failed to update product"
        );
      } else {
        setMessage("Failed to update product");
      }
    }
  };

  // =========================
  // RESTOCK
  // =========================
  const restockProduct = async (id) => {
    const quantity = prompt("Enter restock quantity:");

    if (quantity === null) return;

    const restockQuantity = Number(quantity);

    if (restockQuantity <= 0) {
      setMessage("Restock quantity must be greater than 0");
      return;
    }

    try {
      const response = await api.put(
        `/products/${id}/restock`,
        {
          quantity: restockQuantity,
        }
      );

      setMessage(response.data.message);

      getProducts();
    } catch (error) {
      console.log(error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "Failed to restock product"
        );
      } else {
        setMessage("Failed to restock product");
      }
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/products/${id}`);

      setMessage(response.data.message);

      getProducts();
    } catch (error) {
      console.log(error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "Failed to delete product"
        );
      } else {
        setMessage("Failed to delete product");
      }
    }
  };

  // =========================
  // SUMMARY
  // =========================
  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => Number(product.stock) > 10
  ).length;

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 10
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  return (
    <div
      style={{
        padding: "30px",
        background: "#f7fafb",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            fontSize: "30px",
            marginBottom: "8px",
            color: "#1f2937",
            fontWeight: "700",
          }}
        >
          Product Management
        </h1>

        <p
          style={{
            color: "#6b7280",
            margin: 0,
          }}
        >
          Manage your products, pricing and inventory
        </p>
      </div>

      {/* =========================
          ADD PRODUCT
      ========================= */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#1f2937",
            fontWeight: "700",
          }}
        >
          Add Product
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">Select Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Personal Care">
              Personal Care
            </option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Initial Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={addProduct}
          style={addButton}
        >
          + Add Product
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              fontWeight: "600",
              color: "#0f766e",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* =========================
          INVENTORY SUMMARY
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
        />

        <SummaryCard
          title="In Stock"
          value={inStock}
          icon="🟢"
        />

        <SummaryCard
          title="Low Stock"
          value={lowStock}
          icon="🟡"
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStock}
          icon="🔴"
        />
      </div>

      {/* =========================
          PRODUCT TABLE
      ========================= */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          overflowX: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#1f2937",
            fontWeight: "700",
          }}
        >
          Products
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "750px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f3f4f6",
                textAlign: "left",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#6b7280",
                  }}
                >
                  No products available
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const currentStock = Number(
                  product.stock
                );

                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <td style={tdStyle}>
                      #{product.id}
                    </td>

                    <td style={tdStyle}>
                      <strong
                        style={{
                          color: "#1f2937",
                        }}
                      >
                        {product.product_name}
                      </strong>
                    </td>

                    <td style={tdStyle}>
                      {product.category}
                    </td>

                    <td style={tdStyle}>
                      ₹
                      {Number(product.price).toFixed(
                        2
                      )}
                    </td>

                    <td style={tdStyle}>
                      <strong
                        style={{
                          color: "#1f2937",
                        }}
                      >
                        {currentStock}
                      </strong>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "13px",
                        }}
                      >
                        {currentStock === 0
                          ? "🔴 Out of Stock"
                          : currentStock <= 10
                          ? "🟡 Low Stock"
                          : "🟢 In Stock"}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          updateProduct(product.id)
                        }
                        style={smallButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          restockProduct(product.id)
                        }
                        style={smallButton}
                      >
                        Restock
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                        style={deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================
// SUMMARY CARD
// =========================

function SummaryCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "16px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "25px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#6b7280",
          marginTop: "8px",
          marginBottom: "0",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginTop: "5px",
          marginBottom: "0",
          color: "#1f2937",
          fontWeight: "700",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

// =========================
// INPUT STYLE
// =========================

const inputStyle = {
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  color: "#1f2937",
  background: "#ffffff",
};

// =========================
// ADD BUTTON
// =========================

const addButton = {
  marginTop: "18px",
  padding: "12px 22px",
  background: "#0f766e",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
};

// =========================
// SMALL BUTTON
// =========================

const smallButton = {
  padding: "7px 10px",
  marginRight: "6px",
  border: "none",
  borderRadius: "7px",
  background: "#e0f2f1",
  color: "#0f766e",
  cursor: "pointer",
  fontWeight: "600",
};

// =========================
// DELETE BUTTON
// =========================

const deleteButton = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "7px",
  background: "#fee2e2",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "600",
};

// =========================
// TABLE HEADER STYLE
// =========================

const thStyle = {
  padding: "14px",
  fontSize: "14px",
  color: "#374151",
  fontWeight: "700",
};

// =========================
// TABLE DATA STYLE
// =========================

const tdStyle = {
  padding: "14px",
  fontSize: "14px",
  color: "#374151",
};

export default Products;