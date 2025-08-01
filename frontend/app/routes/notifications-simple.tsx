import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const [notifications] = useState([
    {
      id: "1",
      type: "task",
      title: "Test Notification",
      message: "This is a test notification to verify the system is working",
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium"
    }
  ]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Simple notification system test
            </p>
          </div>
        </div>

        {/* Simple Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-blue-50">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Just now
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Test Buttons */}
        <div className="mt-8 p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-4">Quick Test</h3>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              onClick={() => alert('Notification system is working!')}
            >
              Test Basic Functionality
            </button>
            <button 
              className="px-4 py-2 border rounded hover:bg-accent"
              onClick={() => console.log('Console test working')}
            >
              Console Test
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Status Check:</h4>
          <ul className="text-sm space-y-1">
            <li>✅ Page loads successfully</li>
            <li>✅ Basic styling is working</li>
            <li>✅ Components render properly</li>
            <li>🔧 Advanced features will be added back incrementally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
