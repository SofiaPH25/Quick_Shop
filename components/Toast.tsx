
import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const baseClasses = "p-4 rounded-md shadow-lg text-white text-sm";
  const typeClasses = {
    success: "bg-secondary",
    error: "bg-accent",
    info: "bg-primary",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[message.type]}`}>
      {message.message}
    </div>
  );
};

interface ToastContainerProps {
  messages: ToastMessage[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {messages.map((msg) => (
        <Toast key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
    