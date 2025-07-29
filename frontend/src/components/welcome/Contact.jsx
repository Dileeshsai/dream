import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import WelcomeHeader from './WelcomeHeader';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you for contacting us! We\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <>
      <WelcomeHeader />

      {/* Contact Section */}
      <main className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-white via-blue-50 to-sky-100 px-4 py-12">
        <Card className="w-full max-w-2xl mx-auto border-blue-200 shadow-2xl rounded-3xl">
          <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-r from-sky-100 via-blue-50 to-white rounded-t-3xl">

            <CardTitle className="text-3xl font-bold text-sky-800">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              <TooltipProvider>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    </TooltipTrigger>
                    <TooltipContent>Enter your full name</TooltipContent>
                  </Tooltip>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    </TooltipTrigger>
                    <TooltipContent>We'll never share your email.</TooltipContent>
                  </Tooltip>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                    </TooltipTrigger>
                    <TooltipContent>How can we help you?</TooltipContent>
                  </Tooltip>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    required
                  />
                </div>
              </TooltipProvider>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {loading && <Progress value={80} className="my-2" />}
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-400 via-blue-400 to-sky-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-sky-700 transition-all text-lg" disabled={loading}>Send Message</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
              <div className="flex items-center gap-3 text-sky-700"><Mail className="w-5 h-5" /> contact@unitynest.org</div>
              <div className="flex items-center gap-3 text-sky-700"><Phone className="w-5 h-5" /> +91 98765 43210</div>
              <div className="flex items-center gap-3 text-sky-700"><MapPin className="w-5 h-5" /> 123, Dream Society, India</div>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-sky-200 via-blue-100 to-white px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="text-lg font-bold text-sky-800">UNITY Nest</div>
            <p className="text-sm text-sky-600">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Linkedin /></a>
            <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Twitter /></a>
            <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Facebook /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Contact; 