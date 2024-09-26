import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" required />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  )
}