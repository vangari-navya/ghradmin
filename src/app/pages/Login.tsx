import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Phone, Lock, KeyRound } from 'lucide-react';
import logo from "../../assets/logo.jpeg";

export function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!phoneNumber || phoneNumber.length < 10) {
    toast.error('Enter valid phone number');
    return;
  }

  if (!password || password.length < 4) {
    toast.error('Password must be at least 4 characters');
    return;
  }

  try {
    setIsLoading(true);

    const response = await fetch('https://ghrbackenddata.onrender.com/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // ✅ Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('phoneNumber', phoneNumber);

    toast.success('Login successful!');
    navigate('/dashboard');

  } catch (error: any) {
    toast.error(error.message || 'Something went wrong');
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-[#E6F2F7]">

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/40">

        {/* Logo */}
       <div className="flex flex-col items-center mb-8">
  <img
    src={logo}
    alt="Logo"
    className="h-16 w-auto object-contain"
  />
</div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Login
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your phone number and password
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10 h-12 rounded-xl focus:ring-[#1E5F85] focus:border-[#1E5F85]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 rounded-xl focus:ring-[#1E5F85] focus:border-[#1E5F85]"
            />
          </div>

          {/* Button */}
          <Button className="w-full h-12 rounded-xl bg-[#1E5F85] hover:bg-[#174a68] text-white">
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

        </form>
      </div>
    </div>
  );
}