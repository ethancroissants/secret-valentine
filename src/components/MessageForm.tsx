import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, PaperPlaneRight, EnvelopeSimple, Phone } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useKV } from '@github/spark/hooks';

interface Message {
  id: string;
  recipientName: string;
  message: string;
  contactMethod: 'email' | 'phone';
  contactValue: string;
  timestamp: number;
  fulfilled: boolean;
}

export function MessageForm() {
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [messages = [], setMessages] = useKV<Message[]>('valentine-messages', []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      toast.error('Please enter the recipient\'s name');
      return;
    }

    if (!message.trim()) {
      toast.error('Please write a message');
      return;
    }

    if (!contactValue.trim()) {
      toast.error(`Please enter ${contactMethod === 'email' ? 'an email' : 'a phone number'}`);
      return;
    }

    if (contactMethod === 'email' && !validateEmail(contactValue)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (contactMethod === 'phone' && !validatePhone(contactValue)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    const newMessage: Message = {
      id: Date.now().toString(),
      recipientName: recipientName.trim(),
      message: message.trim(),
      contactMethod,
      contactValue: contactValue.trim(),
      timestamp: Date.now(),
      fulfilled: false,
    };

    setMessages((currentMessages = []) => [...currentMessages, newMessage]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowSuccess(true);

    setRecipientName('');
    setMessage('');
    setContactValue('');

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative z-10"
      >
        <Card className="gradient-card p-12 text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          >
            <Heart size={64} weight="fill" className="text-accent mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Message Sent!</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Your anonymous Valentine's message has been submitted. We'll deliver it with care.
          </p>
          <Button
            onClick={() => setShowSuccess(false)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Send Another Message
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <Card className="gradient-card p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart size={48} weight="fill" className="text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Send Anonymous Love
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Share your feelings without revealing your identity
          </p>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
            <ShieldCheck size={16} className="mr-2" weight="fill" />
            Completely Anonymous - We never collect sender information
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient-name" className="text-sm font-medium">
              Recipient's Name
            </Label>
            <Input
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Who is this message for?"
              className="glow-focus"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              The person you're sending this Valentine to
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Your Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt message here..."
              rows={6}
              className="glow-focus resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Express your feelings - your identity stays secret
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Contact Method</Label>
            <RadioGroup
              value={contactMethod}
              onValueChange={(value) => setContactMethod(value as 'email' | 'phone')}
              className="flex gap-4"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="email" id="email" />
                <Label
                  htmlFor="email"
                  className="flex items-center cursor-pointer text-sm font-normal"
                >
                  <EnvelopeSimple size={18} className="mr-2 text-primary" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="phone" id="phone" />
                <Label
                  htmlFor="phone"
                  className="flex items-center cursor-pointer text-sm font-normal"
                >
                  <Phone size={18} className="mr-2 text-primary" />
                  Phone
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-value" className="text-sm font-medium">
              {contactMethod === 'email' ? 'Recipient\'s Email' : 'Recipient\'s Phone Number'}
            </Label>
            <Input
              id="contact-value"
              type={contactMethod === 'email' ? 'email' : 'tel'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                contactMethod === 'email'
                  ? 'their.email@example.com'
                  : '+1 (555) 123-4567'
              }
              className="glow-focus"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              We'll deliver your message to this {contactMethod}
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6 pulse-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Heart size={20} weight="fill" className="mr-2 animate-pulse" />
                  Sending with Love...
                </>
              ) : (
                <>
                  <PaperPlaneRight size={20} weight="fill" className="mr-2" />
                  Send Anonymous Message
                </>
              )}
            </Button>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 text-center text-sm text-muted-foreground border border-primary/10">
            <ShieldCheck size={20} className="inline-block mr-2 text-primary" weight="fill" />
            Your identity is completely protected. We don't ask for or store any information about
            you.
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
