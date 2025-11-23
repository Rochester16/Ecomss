import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import "../../components/Admin.css";
import Navbar from "../../components/Navbar";
import { useToast } from "../../components/ToastProvider";

export default function AddProductPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [isEdit]);

  async function loadProduct() {
    try {
      const res = await API.get(`/products/${id}`);
      setForm({
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        stock: res.data.stock,
      });
    } catch (err) {
      console.error(err);
      toast.show("Failed to load product", { type: "danger" });
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (file) data.append("image", file);
  
    try {
      if (isEdit) {
        await API.put(`/products/${id}`, data);
        toast.show("Product updated successfully!", { type: "success" });
      } else {
        await API.post("/products/add", data); // ✅ use "data"
        toast.show("Product added successfully!", { type: "success" });
      }
  
      navigate("/admin/products");
  
    } catch (err) {
      console.error(err);
      toast.show(err.response?.data?.message || "Failed to save product", {
        type: "danger",
      });
    }
  }
   

  return (
    <>
      <Navbar />

      <section className="card panel form-card">
        <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
          />

          <button type="submit" className="btn-primary">
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </form>
      </section>
    </>
  );
}
