import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

interface Product {
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
}

interface TransformedData {
  month: string;
  sales: number;
  title: string;
  image: string;
}

const SalesDashboard: React.FC = () => {
  const [data, setData] = useState<TransformedData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [topProduct, setTopProduct] = useState<TransformedData | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/categories');
        const json = await res.json();
        if (Array.isArray(json)) {
          const formatted = json.map((item) =>
            typeof item === 'string' ? item : item.slug || item.name
          );
          setCategories(formatted);
        } else {
          console.error('Invalid categories format:', json);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const url = selectedCategory === 'all'
          ? 'https://dummyjson.com/products'
          : `https://dummyjson.com/products/category/${selectedCategory}`;
        const res = await fetch(url);
        const json = await res.json();

        const products: Product[] = Array.isArray(json.products) ? json.products : json;
        const transformed: TransformedData[] = products.slice(0, 10).map((product, index) => ({
          month: `Month ${index + 1}`,
          sales: product.price * product.stock,
          title: product.title,
          image: product.thumbnail,
        })).sort((a, b) => b.sales - a.sales);

        setData(transformed);

        const top = transformed.reduce((max, p) => (p.sales > max.sales ? p : max), transformed[0]);
        setTopProduct(top);
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      }
    };

    fetchSalesData();
  }, [selectedCategory]);

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', backgroundColor: '#f9f9f9', minHeight: '100vh', width: '91vw', overflowX: 'hidden' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>📈 Sales Performance Dashboard</h1>
      <h2 style={{ textAlign: 'center', color: '#555' }}>
        Total Sales: <span style={{ color: '#007bff' }}>${totalSales.toLocaleString()}</span>
      </h2>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <label htmlFor="category" style={{ marginRight: '10px' }}>Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {topProduct && (
        <div style={{
          margin: '2rem auto',
          padding: '1rem',
          background: '#fff',
          borderRadius: '12px',
          maxWidth: '600px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#28a745' }}>🏆 Top Product: {topProduct.title}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <img
              src={topProduct.image}
              alt={topProduct.title}
              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
            />
          </div>
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
            Sales: ${topProduct.sales.toLocaleString()}
          </p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#333' }}>Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#007bff" strokeWidth={3} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ color: '#333' }}>Sales by Product</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
            <XAxis dataKey="title" angle={-30} textAnchor="end" interval={0} height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" />
            <Bar dataKey="sales" fill="#28a745" radius={[4, 4, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesDashboard;
