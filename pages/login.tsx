import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any previous errors

    try {
      // Make a POST request to your backend's login route
      const response = await axios.post('http://localhost:4000/user/login', { email, password });
      console.log('Login success:', response.data);


      // Redirect to a protected page (e.g., homepage) after successful login
      router.push('/');
    } catch (err: any) {
      console.error('Login failed:', err.response?.data?.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Don't have an account? <Link href="/register" className="text-blue-500 hover:text-blue-600">Register</Link>
      </p> 
    </div>
  );
}
