import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";

const LoginPage = () => { 
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState({}); 

  const [form, setForm] = useState({
    email: '', 
    password: ''
  });  

  const handleChange = (e) => {
    setForm({
      ...form, 
      [e.target.name]: e.target.value
    });

    // Clear error saat user mengetik
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrors({}); 
    setLoading(true); 
  
    try {
      const response = await api.post('/login', form); 
      
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token); 
        localStorage.setItem('user_profile', JSON.stringify(response.data.data.user));  

        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: 'Selamat datang kembali di Facegram',
          confirmButtonColor: 'var(--color-primary)',
        });  

        navigate('/'); 
      } else {
        const message = response.data?.message;

        if (message === 'email not found') {
          setErrors({ email: ['Email tidak ditemukan'] });
        } else if (message === 'wrong password') {
          setErrors({ password: ['Password salah'] });
        } else if (message) {
          setErrors({ email: [message] });
        }
      }
    } catch (err) {
      console.error('Login failed:', err);

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.data?.message) {
        setErrors({ email: [err.response.data.message] });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat login',
        });
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-text-primary text-2xl font-bold -tracking-0.5">Selamat datang kembali</h2>
        <p className="text-text-secondary mt-2 text-sm">
          Masuk dan mulailah berkarya
        </p>
      </header>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors duration-200">
            <FaEnvelope className="text-sm" />
          </span>
          <input
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted/60 pl-11 pr-4 py-3 rounded-xl border border-border-default focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 text-sm"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
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
            className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted/60 pl-11 pr-4 py-3 rounded-xl border border-border-default focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 text-sm"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1.5 pl-1">{errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>

      <p className="text-text-secondary text-sm mt-6">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors duration-200"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;