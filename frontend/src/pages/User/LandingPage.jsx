import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/home.css';
import getFallbackImage from '../../utils/imageFallback';
import Footer from '../../components/footer.jsx';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/products');
        const list = res.data.products || [];
        setFeatured(Array.isArray(list) ? list.slice(0, 4) : []);
      } catch (err) {
        console.error('Failed to load featured products', err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-inner">
          <div className="hero-left">
            <img src="/logo.png" alt="Aurevra" className="landing-logo" />
            <h1>DISCOVER TIMELESS ELEGANCE</h1>
            <p className="muted">
              Handcrafted jewelry pieces that celebrate individuality and craftsmanship. 
              Explore our curated collection of timeless designs.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary">
                Shop Collection
              </Link>
              <Link to="/user/register" className="btn btn-ghost">
                Create Account
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="card">
              <div className="card-media">
                <img 
                  src={getFallbackImage('banner')} 
                  alt="Elegant jewelry showcase" 
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Section */}
      <section className="featured-section">
        <h2>Featured Collection</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>Loading featured products...</p>
          </div>
        ) : featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>No featured items available yet.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="featured-list">
            {featured.map(p => (
              <div key={p._id} className="featured-card">
                <img 
                  src={p.image || getFallbackImage(p.name)} 
                  alt={p.name} 
                  loading="lazy" 
                />
                <h3>{p.name}</h3>
                <div className="price">
                  ₱{(p.price || 0).toLocaleString('en-PH')}
                </div>
                <Link 
                  to={`/product/${p._id}`} 
                  className="btn btn-ghost"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}