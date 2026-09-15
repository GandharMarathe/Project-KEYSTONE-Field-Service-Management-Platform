import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="feedback loading"><LoaderCircle size={20} aria-hidden="true" /> {label}</div>;
}

export function EmptyState({ message = "No data available" }: { message?: string }) {
  return <div className="feedback"><Inbox size={25} aria-hidden="true" /><strong>{message}</strong><span>Data will appear here when it is available from the API.</span></div>;
}

export function ErrorState({ message = "Unable to load data. Please try again." }: { message?: string }) {
  return <div className="feedback error"><AlertCircle size={25} aria-hidden="true" /><strong>{message}</strong></div>;
}
