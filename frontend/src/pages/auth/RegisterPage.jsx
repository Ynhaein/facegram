import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";

const RegisterPage = () => {  
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);  
  const [errors, setErrors] = useState({}); 
  const [form, setForm] = useState({
    username: '', 
    email: '', 
    password: '' 
  }); 

  const handleChange = (e) => {
    setForm({
      ...form, 
      [e.target.name]: e.target.value
    }); 

    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setErrors({}); 
    setLoading(true);  

    try {
      const response = await api.post('/register', form); 

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token); 
        localStorage.setItem('user_profile', JSON.stringify(response.data.data.user)); 
        
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil!',
          text: 'Selamat datang di Facegram',
          confirmButtonColor: 'var(--color-primary)',
        }); 

        navigate('/'); 
      } 
    } catch (err) {
      console.error('Register failed:', err);

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } 
      else if (err.response?.data?.message) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.response.data.message,
        });
      } 
      else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat registrasi',
        });
      }
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-text-primary text-2xl font-bold">Buat Akun Baru</h2>
        <p className="text-text-secondary mt-1.5 text-sm">
          Daftar dan mulai bagikan momenmu
        </p>
      </header>

      <form onSubmit={handleRegister} className="space-y-4.5">
        
        {/* Username */}
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors duration-200">
            <FaUser className="text-sm" />
          </span>
          <input
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted/60 pl-11 pr-4 py-3 rounded-xl border border-transparent focus:border-primary/50 focus:outline-none transition-all duration-200 text-sm"
            type="text"  
            name="username"
            onChange={handleChange}
            value={form.username}
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-danger text-xs mt-1.5 pl-1">{errors.username[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors duration-200">
            <FaEnvelope className="text-sm" />
          </span>
          <input
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted/60 pl-11 pr-4 py-3 rounded-xl border border-transparent focus:border-primary/50 focus:outline-none transition-all duration-200 text-sm"
            type="email"
            name="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-danger text-xs mt-1.5 pl-1">{errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors duration-200">
            <FaLock className="text-sm" />
          </span>
          <input
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted/60 pl-11 pr-4 py-3 rounded-xl border border-transparent focus:border-primary/50 focus:outline-none transition-all duration-200 text-sm"
            type="password"
            name="password"
            onChange={handleChange}
            value={form.password}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1.5 pl-1">{errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p className="text-text-secondary text-sm mt-6">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors duration-200">
          Masuk
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;