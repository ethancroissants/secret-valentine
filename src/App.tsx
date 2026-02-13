import { useState } from 'react';
import { FloatingHearts } from '@/components/FloatingHearts';
import { MessageForm } from '@/components/MessageForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <>
        <FloatingHearts />
        <AdminPanel onBack={() => setShowAdmin(false)} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-12">
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