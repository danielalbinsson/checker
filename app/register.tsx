import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" required />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" id="confirmPassword" required />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}