'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck, CircleX, RefreshCcw, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CheckResult {
  statusCode: number;
  checkedAt: string;
  _id: string;
}

interface Url {
  _id: string;
  url: string;
  frequency: number;
  checks: CheckResult[];
  dateAdded: string;
  user: string;
  __v: number;
}

export default function HomePage() {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState('1');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store the user email
  const { toast } = useToast();

// Fetch URLs from the backend after checking authentication
useEffect(() => {
  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/geturls', {
        withCredentials: true, // Sends the session cookie with the request
      });
      console.log('Backend response:', response.data);

      // Since response.data is an array of URLs
      setUrls(
        response.data.map((url: Url) => ({
          ...url,
          checks: url.checks || [],
        }))
      );

      // If the user email is part of the response, set it accordingly
      // For example, if response.data includes email:
      // setUserEmail(response.data.email || null);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // If unauthorized, redirect to login
        router.push('/login');
      } else {
        console.error('Error fetching URLs:', error);
        setError('Failed to fetch URLs');
      }
    }
  };

  fetchUrls(); // Call the function directly
}, [router]);


  // Function to add a new URL
  const addUrl = async () => {
    toast({
      title: 'Adding URL',
      description: 'Please wait...',
    });
    if (newUrl) {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/addurl',
          { url: newUrl, frequency: newFrequency },
          { withCredentials: true }
        );
        const newUrlData: Url = response.data.url;
  
        setUrls((prevUrls) => [...prevUrls, newUrlData]);
        setNewUrl('');
        setNewFrequency('1');
      } catch (error) {
        console.error('Error adding URL:', error);
        setError('Failed to add URL');
      }
    }
  };
  

  // Function to remove a URL
  const removeUrl = async (id: string) => {
    toast({
      title: `Removing ${id}`,
      description: "...",
    });
    try {
      await axios.delete(`http://localhost:4000/api/removeurl/${id}`, {
        withCredentials: true // Important: Sends the session cookie with the request
      });
      setUrls(urls.filter((url) => url._id !== id)); // Remove the URL from the list
    } catch (error) {
      console.error('Error removing URL:', error);
      setError('Failed to remove URL');
    }
  };

  const checkUrl = async (urlToCheck: string, urlId: string) => {
    toast({
      title: `Checking ${urlToCheck}`,
      description: "Please wait...",
    });
    try {
      const response = await axios.post(
        'http://localhost:4000/api/checkurl',
        { url: urlToCheck },
        {
          withCredentials: true, // Include credentials if session authentication is needed
        }
      );
      console.log('URL Check Successful:', response.data);
  
      // Assuming response.data is the new check result
      const newCheck: CheckResult = response.data;
  
      // Update the specific URL's checks with the new result
      setUrls((prevUrls) =>
        prevUrls.map((url) => {
          if (url._id === urlId) {
            return { ...url, checks: [...(url.checks || []), newCheck] };
          }
          return url;
        })
      );
    } catch (error: any) {
      console.error('Error checking URL:', error.response?.data?.message || error.message);
    }
  };
  
  
  
    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:4000/auth/logout', {}, {
          withCredentials: true, // Send session cookie with the request
        });
        router.push('/login'); // Redirect to login page after logout
      } catch (err: any) { // Assert 'err' as 'any'
        console.error('Logout failed:', err.response?.data?.message || 'Unknown error');
      }
    };
  


  return (
    <div className="m-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Checker</h1>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">{userEmail}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src='/placeholder.svg?height=32&width=32' alt="User Avatar" />
                  <AvatarFallback>{userEmail?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white'>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex mt-8">
        <div className="flex-grow">
          <Label htmlFor="newUrl">New URL</Label>
          <Input 
            id="newUrl" 
            value={newUrl} 
            onChange={(e) => setNewUrl(e.target.value)} 
            placeholder="Enter URL" 
          />
          </div>
        
          <div className="">
            <Label htmlFor="frequency">Check Frequency (hours)</Label>
            <Select value={newFrequency} onValueChange={setNewFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Button className="bg-black text-white mt-6" onClick={addUrl}>Add URL</Button>
          </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Table className="mt-4 text-gray-500 text-xs">
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Check History</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-black text-sm">
  {urls.length > 0 ? (
    urls.map((url: Url) => (
      <TableRow key={url._id}>
        <TableCell>{url.url}</TableCell>
        <TableCell>{url.frequency}</TableCell>
        <TableCell>
          {url.checks && url.checks.length > 0 ? (
            url.checks.map((check, index) => (
              <div key={index} className="inline-block mr-2">
                {check.statusCode >= 200 && check.statusCode < 300 ? (
                  <CircleCheck className="w-6 h-6 text-green-700" />
                ) : (
                  <CircleX className="w-6 h-6 text-red-600" />
                )}
              </div>
            ))
          ) : (
            <span>No checks available</span>
          )}
        </TableCell>
        <TableCell>
          <Button
            className="bg-gray-100 text-black hover:bg-gray-400 mx-2 h-8"
            variant="destructive"
            onClick={() => removeUrl(url._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>

          <Button
            className="bg-gray-100 text-black hover:bg-gray-400 h-8"
            onClick={() => checkUrl(url.url, url._id)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Check
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4}>No URLs available</TableCell>
    </TableRow>
  )}
</TableBody>


      </Table>
      <Toaster />
    </div>
  );
}