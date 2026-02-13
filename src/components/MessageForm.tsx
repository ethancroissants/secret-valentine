import { useState } from 'react';
import { PaperPlaneRight, EnvelopeSimple, Phone, Heart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { createMessage, type NewMessage } from '@/lib/db';

export function MessageForm() {
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

    const newMessage: NewMessage = {
      recipientName: recipientName.trim(),
      message: message.trim(),
      contactMethod,
      contactValue: contactValue.trim(),
    };

    try {
      await createMessage(newMessage);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setShowSuccess(true);

    setRecipientName('');
    setMessage('');
    setContactValue('');

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (showSuccess) {
    return (
      <Card className="p-10 text-center max-w-md mx-auto border-primary/20 shadow-lg shadow-primary/5">
        <Heart size={56} weight="fill" className="text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-semibold text-foreground mb-3">Sent</h2>
        <p className="text-muted-foreground mb-6">
          Your message will be delivered soon! This may take up to 5 hours since sending texts are kinda expensive tbh.
        </p>
        <Button
          onClick={() => setShowSuccess(false)}
          variant="outline"
          className="border-primary/30 hover:bg-primary/10"
        >
          Send Another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 md:p-10 max-w-xl mx-auto border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/95">
      <div className="mb-8 text-center">
        <Heart size={48} weight="fill" className="text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-3 tracking-tight">
          secret valentine thingy
        </h1>
        <p className="text-muted-foreground">
          Send a message without them knowing :D
          <br />
          Dont abuse this please
          <br />
          design not by me, everything else I made though
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="recipient-name" className="text-sm font-medium">
            Recipient Name
          </Label>
          <Input
            id="recipient-name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Who is this for?"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={5}
            className="resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Contact Method</Label>
          <RadioGroup
            value={contactMethod}
            onValueChange={(value) => setContactMethod(value as 'email' | 'phone')}
            className="flex gap-4"
            disabled={isSubmitting}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label
                htmlFor="email"
                className="flex items-center cursor-pointer text-sm font-normal"
              >
                <EnvelopeSimple size={16} className="mr-1.5" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label
                htmlFor="phone"
                className="flex items-center cursor-pointer text-sm font-normal"
              >
                <Phone size={16} className="mr-1.5" />
                Phone
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-value" className="text-sm font-medium">
            {contactMethod === 'email' ? 'Recipient Email' : 'Recipient Phone'}
          </Label>
          <Input
            id="contact-value"
            type={contactMethod === 'email' ? 'email' : 'tel'}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={
              contactMethod === 'email'
                ? 'email@example.com'
                : '+1 (555) 123-4567'
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <PaperPlaneRight size={18} className="mr-2" weight="fill" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
