import { useState, useEffect, type FormEvent } from 'react';
import {
  EnvelopeSimple,
  Phone,
  CheckCircle,
  Clock,
  ArrowLeft,
  Heart,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { fetchMessages, updateMessageFulfilled, type Message } from '@/lib/db';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'EthanIsCool';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin-auth') === 'true';
    setIsAuthenticated(savedAuth);
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        toast.error('Failed to load messages. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleAuthenticate = (event: FormEvent) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setAuthError('');
      setPassword('');
      return;
    }
    setAuthError('Incorrect password');
  };

  const toggleFulfilled = async (id: string) => {
    const target = messages.find((msg) => msg.id === id);
    if (!target) return;
    const nextFulfilled = !target.fulfilled;

    setMessages((currentMessages) =>
      currentMessages.map((msg) =>
        msg.id === id ? { ...msg, fulfilled: nextFulfilled } : msg
      )
    );

    try {
      const updated = await updateMessageFulfilled(id, nextFulfilled);
      if (!updated) {
        throw new Error('Message not found');
      }
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === id ? updated : msg
        )
      );
      toast.success('Status updated');
    } catch (error) {
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === id ? { ...msg, fulfilled: target.fulfilled } : msg
        )
      );
      toast.error('Failed to update status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="p-10 text-center max-w-md border-primary/20 shadow-xl shadow-primary/10 w-full">
          <h2 className="text-3xl font-semibold text-foreground mb-3">Admin Login</h2>
          <p className="text-muted-foreground mb-6">
            Enter the admin password to continue.
          </p>
          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
              {authError ? (
                <p className="text-sm text-destructive">{authError}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
          <Button
            onClick={onBack}
            variant="outline"
            className="mt-4 w-full border-primary/30 hover:bg-primary/10"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heart size={40} className="text-primary animate-pulse mx-auto mb-4" weight="fill" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  const pendingMessages = sortedMessages.filter((msg) => !msg.fulfilled);
  const fulfilledMessages = sortedMessages.filter((msg) => msg.fulfilled);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage submitted messages
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="border-primary/30 hover:bg-primary/10">
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending">
              Pending ({pendingMessages.length})
            </TabsTrigger>
            <TabsTrigger value="fulfilled">
              Fulfilled ({fulfilledMessages.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingMessages.length === 0 ? (
              <Card className="p-10 text-center border-primary/20">
                <CheckCircle size={48} className="text-muted-foreground/50 mx-auto mb-4" weight="fill" />
                <p className="text-muted-foreground">
                  No pending messages
                </p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {pendingMessages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onToggleFulfilled={toggleFulfilled}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="fulfilled" className="space-y-4">
            {fulfilledMessages.length === 0 ? (
              <Card className="p-10 text-center border-primary/20">
                <Clock size={48} className="text-muted-foreground/50 mx-auto mb-4" weight="fill" />
                <p className="text-muted-foreground">
                  No fulfilled messages yet
                </p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {fulfilledMessages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onToggleFulfilled={toggleFulfilled}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {messages.length === 0 ? (
              <Card className="p-10 text-center border-primary/20">
                <Heart size={48} className="text-muted-foreground/50 mx-auto mb-4" weight="fill" />
                <p className="text-muted-foreground">
                  No messages yet
                </p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {sortedMessages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onToggleFulfilled={toggleFulfilled}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface MessageCardProps {
  message: Message;
  onToggleFulfilled: (id: string) => void;
}

function MessageCard({ message, onToggleFulfilled }: MessageCardProps) {
  const date = new Date(message.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            To: {message.recipientName}
          </h3>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <Badge
          variant={message.fulfilled ? 'default' : 'secondary'}
          className={
            message.fulfilled
              ? 'bg-primary/20 text-primary border-primary/40'
              : 'bg-accent/20 text-accent border-accent/40'
          }
        >
          {message.fulfilled ? (
            <>
              <CheckCircle size={14} className="mr-1" weight="fill" />
              Fulfilled
            </>
          ) : (
            <>
              <Clock size={14} className="mr-1" weight="fill" />
              Pending
            </>
          )}
        </Badge>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 mb-4 border border-primary/10">
        <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {message.contactMethod === 'email' ? (
            <EnvelopeSimple size={16} weight="fill" />
          ) : (
            <Phone size={16} weight="fill" />
          )}
          <span className="font-medium">{message.contactValue}</span>
        </div>

        <Button
          onClick={() => onToggleFulfilled(message.id)}
          variant={message.fulfilled ? 'outline' : 'default'}
          size="sm"
          className={message.fulfilled ? 'border-primary/30 hover:bg-primary/10' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'}
        >
          {message.fulfilled ? 'Mark Pending' : 'Mark Fulfilled'}
        </Button>
      </div>
    </Card>
  );
}
