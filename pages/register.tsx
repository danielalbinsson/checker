import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to your backend's register route
      const response = await axios.post('http://localhost:4000/user/register', { email, password });
      console.log('Registration success:', response.data);

      // Optionally, store the token or any session data
      // localStorage.setItem('token', response.data.token);

      // Redirect to the login page after successful registration
      router.push('/login');
    } catch (err: any) {
      console.error('Registration failed:', err.response?.data?.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
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
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Register</Button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-600">Login</Link>
      </p> 
    </div>
  );
}
