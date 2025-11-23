import React, { useState, useEffect } from "react";
import API from "../../api";
import "../../styles/AdminEditProduct.css";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const res = await API.get(`/products/${id}`);
      const p = res.data;

      setForm({
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
      });

      if (p.image) {
        setPreview(`http://localhost:5000/uploads/${p.image}`);
      }
    } catch (err) {
      console.log("Failed to load product:", err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function saveChanges() {
    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("description", form.description);
    if (image) data.append("image", image);

    await API.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/admin/products");
  }

  async function deleteProduct() {
    await API.delete(`/products/${id}`);
    navigate("/admin/products");
  }

  return (
    <div className="pm-wrapper">
      <div className="pm-card">

        {/* HEADER TABS */}
        <div className="pm-tabs">
          <Link to="/admin/products/add" className="tab-btn">ADD PRODUCT</Link>
          <button className="tab-btn active">EDIT PRODUCT</button>
          <Link to="/admin/inventory" className="tab-btn">INVENTORY TRACKING</Link>
        </div>

        {/* FORM CONTENT */}
        <div className="pm-form">
          <label>
            PRODUCT NAME
            <input name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            CATEGORY
            <input name="category" value={form.category} onChange={handleChange} />
          </label>

          <label>
            PRICE (₱)
            <input name="price" value={form.price} onChange={handleChange} />
          </label>

          <label className="full">
            DESCRIPTION
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          {/* IMAGE UPLOAD */}
          <div className="upload-box">
            {preview ? (
              <img src={preview} alt="preview" className="preview-img" />
            ) : (
              <p>Drag & drop images here<br/>or click to upload</p>
            )}
            <input type="file" onChange={handleImage} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="pm-actions">
            <button className="btn-save" onClick={saveChanges}>SAVE CHANGES</button>
            <button className="btn-cancel" onClick={() => navigate(-1)}>CANCEL</button>
            <button className="btn-delete" onClick={deleteProduct}>DELETE PRODUCT</button>
          </div>

        </div>
      </div>
    </div>
  );
}
