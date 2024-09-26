import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [slack, setSlack] = useState('')
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [slackEnabled, setSlackEnabled] = useState(false)

  const saveSettings = () => {
    // Here you would typically save these settings to your backend
    console.log('Saving settings:', { email, telegram, slack, emailEnabled, telegramEnabled, slackEnabled })
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email for Notifications</Label>
          <Input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              id="email-notifications" 
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
            <Label htmlFor="email-notifications">Enable Email Notifications</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="telegram">Telegram Username</Label>
          <Input 
            type="text" 
            id="telegram" 
            value={telegram} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegram(e.target.value)} 
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              id="telegram-notifications" 
              checked={telegramEnabled}
              onCheckedChange={setTelegramEnabled}
            />
            <Label htmlFor="telegram-notifications">Enable Telegram Notifications</Label>
          </div>
        </div>
        <div>
          <Label htmlFor="slack">Slack Webhook URL</Label>
          <Input 
            type="text" 
            id="slack" 
            value={slack} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlack(e.target.value)} 
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch 
              id="slack-notifications" 
              checked={slackEnabled}
              onCheckedChange={setSlackEnabled}
            />
            <Label htmlFor="slack-notifications">Enable Slack Notifications</Label>
          </div>
        </div>
        <Button type="button" onClick={saveSettings} className="w-full">Save Settings</Button>
      </form>
    </div>
  )
}