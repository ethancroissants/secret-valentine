import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  EnvelopeSimple,
  Phone,
  CheckCircle,
  Clock,
  ArrowLeft,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';

interface Message {
  id: string;
  recipientName: string;
  message: string;
  contactMethod: 'email' | 'phone';
  contactValue: string;
  timestamp: number;
  fulfilled: boolean;
}

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [messages = [], setMessages] = useKV<Message[]>('valentine-messages', []);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const user = await window.spark.user();
        setIsOwner(user?.isOwner ?? false);
      } catch (error) {
        setIsOwner(false);
      }
    };
    checkOwner();
  }, []);

  const toggleFulfilled = (id: string) => {
    setMessages((currentMessages = []) =>
      currentMessages.map((msg) =>
        msg.id === id ? { ...msg, fulfilled: !msg.fulfilled } : msg
      )
    );
    toast.success('Status updated');
  };

  if (isOwner === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heart size={48} weight="fill" className="text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="gradient-card p-12 text-center max-w-md">
            <Heart size={64} weight="fill" className="text-destructive mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              Only the app owner can access the admin panel.
            </p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  const pendingMessages = sortedMessages.filter((msg) => !msg.fulfilled);
  const fulfilledMessages = sortedMessages.filter((msg) => msg.fulfilled);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage and fulfill Valentine's messages
            </p>
          </div>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft size={20} className="mr-2" />
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
              <Card className="gradient-card p-12 text-center">
                <CheckCircle size={64} weight="fill" className="text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No pending messages. You're all caught up!
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
              <Card className="gradient-card p-12 text-center">
                <Clock size={64} weight="fill" className="text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No fulfilled messages yet.
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
              <Card className="gradient-card p-12 text-center">
                <Heart size={64} weight="fill" className="text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No messages yet. Share the app to start receiving Valentine's!
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
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <Card className="gradient-card p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart size={24} weight="fill" className="text-primary" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                For: {message.recipientName}
              </h3>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <Badge
            variant={message.fulfilled ? 'default' : 'secondary'}
            className={
              message.fulfilled
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-orange-100 text-orange-800 border-orange-200'
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

        <div className="bg-secondary/30 rounded-lg p-4 mb-4">
          <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {message.contactMethod === 'email' ? (
              <EnvelopeSimple size={18} className="text-primary" />
            ) : (
              <Phone size={18} className="text-primary" />
            )}
            <span className="font-medium">{message.contactValue}</span>
          </div>

          <Button
            onClick={() => onToggleFulfilled(message.id)}
            variant={message.fulfilled ? 'outline' : 'default'}
            size="sm"
            className={
              !message.fulfilled
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : ''
            }
          >
            {message.fulfilled ? 'Mark as Pending' : 'Mark as Fulfilled'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
