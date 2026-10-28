import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound(){return <section className="not-found"><span>404 · PAGE NOT FOUND</span><h1>This route isn’t on our map.</h1><p>The page may have moved, or the address may be incorrect.</p><Link href="/" className="button button-orange"><ArrowLeft size={15}/> Back to home</Link></section>;}
