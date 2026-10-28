import Link from "next/link";

export function ContentEmptyState({ title, message }: { title: string; message: string }) {
  return <div className="empty-state" role="status">
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <p className="mt-2">{message}</p>
    <Link href="/contact" className="text-link">Contact our team</Link>
  </div>;
}
