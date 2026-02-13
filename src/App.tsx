import { useState } from 'react';
import { MessageForm } from '@/components/MessageForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <>
        <AdminPanel onBack={() => setShowAdmin(false)} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
        <MessageForm />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdmin(true)}
          className="mt-8 text-muted-foreground hover:text-foreground opacity-30 hover:opacity-100 transition-opacity"
        >
          Admin
        </Button>
      </div>

      <Toaster />
    </div>
  );
}

export default App;