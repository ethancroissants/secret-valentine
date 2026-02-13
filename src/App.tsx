import { useState } from 'react';
import { MessageForm } from '@/components/MessageForm';
import { AdminPanel } from '@/components/AdminPanel';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <AdminPanel onBack={() => setShowAdmin(false)} />
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <FloatingHearts />
      <div className="min-h-screen relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
          <MessageForm />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdmin(true)}
            className="mt-8 text-muted-foreground/40 hover:text-foreground/60 opacity-20 hover:opacity-60 transition-all"
          >
            Admin
          </Button>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default App;