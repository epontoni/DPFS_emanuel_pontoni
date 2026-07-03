import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  Tag, 
  Database, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Search, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [lastProduct, setLastProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products and users in parallel
      const [productsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3000/api/products'),
        fetch('http://localhost:3000/api/users')
      ]);

      if (!productsRes.ok || !usersRes.ok) {
        throw new Error('Error al conectar con la API de MakerHub');
      }

      const productsData = await productsRes.json();
      const usersData = await usersRes.json();

      // Compute metrics
      const categoryNames = Object.keys(productsData.countByCategory || {});
      setMetrics({
        totalProducts: productsData.count || 0,
        totalUsers: usersData.count || 0,
        totalCategories: categoryNames.length
      });

      // Map categories
      const categoryList = Object.entries(productsData.countByCategory || {}).map(
        ([name, count]) => ({ name, count })
      );
      setCategories(categoryList);

      // Set products list
      setProducts(productsData.products || []);

      // Fetch last product details if products exist
      if (productsData.products && productsData.products.length > 0) {
        const lastProdSummary = productsData.products[productsData.products.length - 1];
        const lastProdRes = await fetch(lastProdSummary.detail);
        if (lastProdRes.ok) {
          const lastProdDetail = await lastProdRes.json();
          setLastProduct(lastProdDetail);
        }
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo establecer conexión con el servidor de la API en http://localhost:3000. Asegúrate de que el servidor Express esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="spinner" size={48} />
        <p>Cargando métricas de MakerHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>⚠️ Error de Conexión</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="btn-refresh">
            <RefreshCw size={16} /> Reintentar conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-app">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="logo-glow">MH</div>
          <div>
            <h1>MAKERHUB</h1>
            <p className="subtitle text-gradient">Control Panel & Analytics</p>
          </div>
        </div>
        <div className="header-status">
          <div className="status-indicator online"></div>
          <span>API Server: Online</span>
          <button onClick={fetchData} className="icon-btn-refresh" title="Actualizar datos">
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-main">
        {/* KPI Cards */}
        <section className="metrics-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrapper blue">
              <Package size={24} />
            </div>
            <div className="kpi-info">
              <span className="kpi-title">Productos Totales</span>
              <h3 className="kpi-value">{metrics.totalProducts}</h3>
            </div>
            <div className="kpi-glow blue"></div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrapper green">
              <Users size={24} />
            </div>
            <div className="kpi-info">
              <span className="kpi-title">Usuarios Registrados</span>
              <h3 className="kpi-value">{metrics.totalUsers}</h3>
            </div>
            <div className="kpi-glow green"></div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrapper purple">
              <Layers size={24} />
            </div>
            <div className="kpi-info">
              <span className="kpi-title">Categorías</span>
              <h3 className="kpi-value">{metrics.totalCategories}</h3>
            </div>
            <div className="kpi-glow purple"></div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Left Column */}
          <div className="content-column left">
            {/* Last Created Product */}
            <div className="card glass-card last-product-card">
              <div className="card-header">
                <Sparkles size={20} className="text-accent-orange" />
                <h2>Último Producto Creado</h2>
              </div>
              {lastProduct ? (
                <div className="last-product-body">
                  <div className="last-product-image-container">
                    <img src={lastProduct.imageUrl} alt={lastProduct.title} />
                    <span className="badge-price">${lastProduct.price}</span>
                  </div>
                  <div className="last-product-info">
                    <h3>{lastProduct.title}</h3>
                    <p className="description">{lastProduct.description}</p>
                    <div className="attributes">
                      <div>
                        <strong>Categoría:</strong>{' '}
                        <span className="tag">{lastProduct.category ? lastProduct.category.name : 'N/A'}</span>
                      </div>
                      {lastProduct.colors && (
                        <div>
                          <strong>Colores:</strong> <span>{lastProduct.colors}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="no-data">No hay información del último producto</p>
              )}
            </div>

            {/* Categories list */}
            <div className="card glass-card categories-card">
              <div className="card-header">
                <Tag size={20} className="text-accent-purple" />
                <h2>Productos por Categoría</h2>
              </div>
              <div className="categories-list">
                {categories.map((cat, index) => (
                  <div key={index} className="category-item">
                    <span className="category-name">{cat.name}</span>
                    <div className="progress-bar-wrapper">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${(cat.count / metrics.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="category-count">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="content-column right">
            {/* Products List Table */}
            <div className="card glass-card products-list-card">
              <div className="card-header list-header">
                <div className="header-title">
                  <Database size={20} className="text-accent-blue" />
                  <h2>Listado de Productos</h2>
                </div>
                <div className="search-box">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Categorías</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="col-id">#{p.id}</td>
                          <td className="col-name">{p.name}</td>
                          <td className="col-desc">{p.description}</td>
                          <td className="col-cats">
                            {p.categories.map((c, i) => (
                              <span key={i} className="tag-outline">{c}</span>
                            ))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data-row">No se encontraron productos</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
