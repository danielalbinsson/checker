'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Define the URL type
interface Url {
  _id: string;
  url: string;
  frequency: number;
  checks: boolean[]; // Add this line to define 'checks' as an array of booleans
}

export default function HomePage() {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState('1');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false); // State to track if we are on the client

  useEffect(() => {
    setIsClient(true); // Set this to true once the component has mounted (client-side)
  }, []);

  const isAuthenticated = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    if (!isClient) return; // Only proceed if we are on the client side

    if (!isAuthenticated()) {
      router.push('/login'); // Redirect to login if the user is not authenticated
      return;
    }

    // Fetch URLs from the backend
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/geturls', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUrls(response.data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
        setError('Failed to fetch URLs');
      }
    };

    fetchUrls();
  }, [isClient, router]);

  if (!isClient) {
    // Don't render anything until we're on the client
    return null;
  }

  const addUrl = async () => {
    if (newUrl) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:4000/api/addurl', { url: newUrl }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUrls([...urls, response.data.url]); // Add the new URL to the list
        setNewUrl(''); // Clear the input
        setNewFrequency('1'); // Reset frequency
      } catch (error) {
        console.error('Error adding URL:', error);
        setError('Failed to add URL');
      }
    }
  };

  const removeUrl = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/removeurl/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUrls(urls.filter((url) => Number(url._id) !== id)); // Convert url._id to a number
    } catch (error) {
      console.error('Error removing URL:', error);
      setError('Failed to remove URL');
    }
  };

  return (
    <div className="m-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">URL Checker</h1>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">{localStorage.getItem('userEmail')}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src='/placeholder.svg?height=32&width=32' alt="User Avatar" />
                  <AvatarFallback>{localStorage.getItem('userEmail')?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="newUrl">New URL</Label>
        <Input 
          id="newUrl" 
          value={newUrl} 
          onChange={(e) => setNewUrl(e.target.value)} 
          placeholder="Enter URL" 
        />
        
        <div className="w-full sm:w-48 mt-2">
          <Label htmlFor="frequency">Check Frequency (hours)</Label>
          <Select value={newFrequency} onValueChange={setNewFrequency}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end mt-4">
          <Button className="bg-purple-800 text-white" onClick={addUrl}>Add URL</Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Frequency (hours)</TableHead>
            <TableHead>Check History</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url: Url) => (
            <TableRow key={url._id}>
              <TableCell>{url.url}</TableCell>
              <TableCell>{url.frequency}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  {url.checks.map((check, index) => (
                    check ? (
                      <CheckIcon key={index} className="text-green-500 w-4 h-4" />
                    ) : (
                      <XIcon key={index} className="text-red-500 w-4 h-4" />
                    )
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeUrl(Number(url._id))}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
