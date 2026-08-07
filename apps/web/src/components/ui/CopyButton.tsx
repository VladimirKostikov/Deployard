import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
  disabled?: boolean;
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  className = '',
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!value || disabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      disabled={disabled || !value}
      className={`inline-flex h-8 items-center border border-border bg-elevated px-2 text-xs text-secondary transition-colors hover:bg-canvas hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
