'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CircleCheck, CircleX, RefreshCcw, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const [loadingUrlId, setLoadingUrlId] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect called');
    const fetchUrls = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/geturls', {
          withCredentials: true,
        });
        console.log('Backend response:', response.data);

        setUrls(
          response.data.map((url: Url) => ({
            ...url,
            checks: url.checks || [],
          }))
        );
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        } else {
          console.error('Error fetching URLs:', error);
          setError('Failed to fetch URLs');
        }
      }
    };

    fetchUrls();
  }, []);

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
        await fetchUrls();
        setNewUrl('');
        setNewFrequency('1');
      } catch (error) {
        console.error('Error adding URL:', error);
        setError('Failed to add URL');
      }
    }
  };

  const removeUrl = async (id: string) => {
    toast({
      title: 'Removing URL',
      description: 'Please wait...',
    });
    try {
      await axios.delete(`http://localhost:4000/api/removeurl/${id}`, {
        withCredentials: true,
      });
      await fetchUrls();
    } catch (error) {
      console.error('Error removing URL:', error);
      setError('Failed to remove URL');
    }
  };

  const checkUrl = async (urlToCheck: string, urlId: string) => {
    setLoadingUrlId(urlId);
    toast({
      title: `Checking ${urlToCheck}`,
      description: 'Please wait...',
    });
    try {
      const response = await axios.post(
        'http://localhost:4000/api/checkurl',
        { url: urlToCheck },
        { withCredentials: true }
      );
      console.log('URL Check Successful:', response.data);

      const newCheck: CheckResult = response.data;

      setUrls((prevUrls) => {
        const updatedUrls = prevUrls.map((url) => {
          if (url._id === urlId) {
            const updatedChecks = [...(url.checks || []), newCheck];
            return { ...url, checks: updatedChecks };
          }
          return url;
        });
        return updatedUrls;
      });
    } catch (error: any) {
      console.error(
        'Error checking URL:',
        error.response?.data?.message || error.message
      );
      toast({
        title: 'Error',
        description: 'Failed to check the URL. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingUrlId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:4000/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
      router.push('/login');
    } catch (err: any) {
      console.error('Logout failed:', err.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-sky-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Website Monitor
          </h1>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-white">{userEmail}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src='/placeholder.svg?height=36&width=36' alt="User Avatar" />
                    <AvatarFallback>{userEmail?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 backdrop-blur-sm">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="newUrl" className="text-white font-semibold mb-2">New URL</Label>
              <Input 
                id="newUrl" 
                value={newUrl} 
                onChange={(e) => setNewUrl(e.target.value)} 
                placeholder="Enter URL" 
                className="bg-white/50 placeholder-gray-500"
              />
            </div>
            <div>
              <Label htmlFor="frequency" className="text-white font-semibold mb-2">Check Frequency (hours)</Label>
              <Select value={newFrequency} onValueChange={setNewFrequency}>
                <SelectTrigger id="frequency" className="bg-white/50">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                className="w-full bg-slate-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out" 
                onClick={addUrl}
              >
                Add URL
              </Button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-200 text-sm mb-4">{error}</p>}

        <div className="bg-white/80 backdrop-blur-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100/50">
                <TableHead className="w-[200px] font-bold text-gray-700">URL</TableHead>
                <TableHead className="font-bold text-gray-700">Frequency</TableHead>
                <TableHead className="font-bold text-gray-700">Check History</TableHead>
                <TableHead className="font-bold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.length > 0 ? (
                urls.map((url: Url) => (
                  <TableRow key={url._id} className="hover:bg-gray-100/50 transition-colors duration-200">
                    <TableCell className="font-medium">{url.url}</TableCell>
                    <TableCell>{url.frequency}</TableCell>
                    <TableCell>
                      {loadingUrlId === url._id ? (
                        <div className="inline-block mr-2">
                          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                        </div>
                      ) : url.checks && url.checks.length > 0 ? (
                        url.checks
                          .filter((check) => check.statusCode !== undefined && check.statusCode !== null)
                          .map((check, index) => (
                            <div key={index} className="inline-block mr-2">
                              {check.statusCode >= 200 && check.statusCode < 300 ? (
                                <CircleCheck className="w-5 h-5 text-green-700" />
                              ) : (
                                <CircleX className="w-5 h-5 text-red-700" />
                              )}
                            </div>
                          ))
                      ) : (
                        <span className="text-gray-500">No checks available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          className="bg-white text-red-700 hover:bg-red-200 transition-colors duration-200"
                          variant="ghost"
                          onClick={() => removeUrl(url._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-white text-slate-700 hover:bg-blue-200 transition-colors duration-200"
                          variant="ghost"
                          onClick={() => checkUrl(url.url, url._id)}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">No URLs available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster />
    </div>
  );
}