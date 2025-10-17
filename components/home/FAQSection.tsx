"use client";

import React, { useState } from "react";

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

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Common questions about our Library Management System</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <button
              className="w-full text-left p-4 font-medium flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
