'use client';

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
};

const Accordion: React.FC<AccordionProps> = ({ children, className }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);

const AccordionItem: React.FC<{ children: React.ReactNode; isOpen: boolean; onToggle: () => void }> = ({
  children,
  isOpen,
  onToggle
}) => (
    <div className="w-full mb-4 rounded-xl shadow-lg overflow-hidden border border-gray-200">
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const element = child as React.ReactElement<any>;
      if (element.type === AccordionTrigger) return React.cloneElement(element, { isOpen, onToggle });
      if (element.type === AccordionContent) return React.cloneElement(element, { isOpen });
      return element;
    })}
  </div>
);

const AccordionTrigger: React.FC<{ children: React.ReactNode; isOpen?: boolean; onToggle?: () => void }> = ({
  children,
  isOpen,
  onToggle
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex justify-between items-center px-6 py-5 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-900 text-lg"
  >
    {children}
    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
      ▼
    </span>
  </button>
);

const AccordionContent: React.FC<{ children: React.ReactNode; isOpen?: boolean }> = ({ children, isOpen }) => (
  <div
    className={`px-6 py-4 text-gray-700 bg-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${
      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    {children}
  </div>
);

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How can I issue a book?",
      answer: "Log into your account, go to the library dashboard, and select the 'Issue Book' option.",
    },
    {
      question: "What happens if I return a book late?",
      answer: "A small late fee is applied per day past the due date. Check your account to view fines.",
    },
    {
      question: "Can I renew a borrowed book?",
      answer: "Yes, books can be renewed once unless another member has requested it.",
    },
    {
      question: "Can I reserve a book in advance?",
      answer: "Yes, books can be reserved in the catalog if currently available for borrowing.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-20 bg-white flex flex-col items-center">
      <div className="text-center mb-12 px-4 max-w-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-lg">
          Get quick answers to the most common questions about our Library Management System.
        </p>
      </div>

      <Accordion className="w-full max-w-3xl px-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            isOpen={openIndex === index}
            onToggle={() => toggleFAQ(index)}
          >
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
