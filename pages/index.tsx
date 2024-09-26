'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const user = {
  email: 'user@example.com',
  avatarUrl: '/placeholder.svg?height=32&width=32',
};

export default function HomePage() {
  const [urls, setUrls] = useState([
    { id: 1, url: 'https://example.com', frequency: 1, checks: [true, true, false, true] },
    { id: 2, url: 'https://test.com', frequency: 12, checks: [true, true, true, true] },
  ]);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState('1');

  const addUrl = () => {
    if (newUrl) {
      setUrls([...urls, { id: Date.now(), url: newUrl, frequency: parseInt(newFrequency), checks: [] }]); // Use Date.now() for a numeric id
      setNewUrl('');
      setNewFrequency('1');
    }
  };

  const removeUrl = (id: number) => {
    setUrls(urls.filter((url) => url.id !== id));
  };

  return (
    <div className="m-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">URL Checker</h1>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">{user.email}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.email} />
                  <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span className="font-medium">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-8 mb-8">
        <div className="flex-grow">
          <Label htmlFor="newUrl">Add a URL to check</Label>
          <Input
            id="newUrl"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div className="w-full sm:w-48">
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
        <div className="flex items-end">
          <Button onClick={addUrl}>Add URL</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Frequency (hours)</TableHead>
            <TableHead>Check History</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url) => (
            <TableRow key={url.id}>
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
                <Button variant="destructive" onClick={() => removeUrl(url.id)}>
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
