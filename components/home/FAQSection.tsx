"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How can I issue a book?",
      answer: "You can issue a book by logging into your account and selecting the 'Issue Book' option from the library dashboard.",
    },
    {
      question: "What happens if I return a book late?",
      answer: "A small late fee will be charged for each day past the due date. You can view your fines in the account section.",
    },
    {
      question: "Can I renew a borrowed book?",
      answer: "Yes, books can be renewed once unless another member has requested the same book.",
    },
  ];

  return (
    <section className="py-20 mb-20 flex flex-col justify-center items-center">
      <div className="w-full px-2 mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-[70%] mx-auto">Common questions about our Library Management System</p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="max-w-[90%] w-2xl"
      >
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-muted-foreground">
                {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
