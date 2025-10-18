"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Github, Linkedin, Twitter, Mail } from "lucide-react";
import {Link} from 'next/link'
export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark relative mt-4 border-t bg-background">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-6 -top-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-16 bottom-0 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),transparent_40%)]" />
      </div>

      <div className="w-[92%] max-w-7xl mx-auto px-2 md:px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-6 text-primary" />
              <span className="text-xl font-semibold tracking-tight text-blue-400">Smart Library</span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage books, members, and issues with a clean, modern workflow for your library.
            </p>
            <div className="flex items-center gap-3">
              <a aria-label="Twitter" href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="size-5" />
              </a>
              <a aria-label="GitHub" href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="size-5" />
              </a>
              <a aria-label="LinkedIn" href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/librarian/dashboard" className="hover:text-foreground transition-colors">Librarian Dashboard</Link></li>
              <li><Link href="/user/dashboard" className="hover:text-foreground transition-colors">User Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Reports</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">QR Generator</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Stay updated</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get tips, updates, and new features—no spam.
            </p>
            <form
              className="flex w-full items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Your email"
                  className="pl-9 h-10"
                  required
                />
              </div>
              <Button type="submit" className="h-10">Subscribe</Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              By subscribing, you agree to our <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {year} Smart Library MS. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}