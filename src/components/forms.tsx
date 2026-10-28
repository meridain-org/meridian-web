"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

const email = z.string().trim().email("Enter a valid email address.").max(254);
const common = { name: z.string().trim().min(2, "Enter your name.").max(100), company_name: z.string().trim().max(150).optional(), email, phone: z.string().trim().min(7, "Enter a phone number.").max(35), message: z.string().trim().min(10, "Please share a little more detail.").max(4000), website: z.string().max(0).optional() };
const positiveNumber = z.string().optional().refine(value => value === undefined || value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0), "Enter a non-negative number.");
const shippingDate = z.iso.date().optional().or(z.literal(""));
const quoteSchema = z.object({ ...common, company_name: z.string().trim().min(1, "Enter your company name.").max(150), origin_country: z.string().trim().min(2, "Enter an origin country."), origin_city: z.string().trim().min(2, "Enter an origin city."), destination_country: z.string().trim().min(2, "Enter a destination country."), destination_city: z.string().trim().min(2, "Enter a destination city."), service_type: z.string().min(1, "Choose a service."), cargo_type: z.string().trim().min(2, "Describe the cargo."), cargo_weight: positiveNumber, cargo_volume: positiveNumber, preferred_shipping_date: shippingDate });
const contactSchema = z.object({ ...common, subject: z.string().trim().min(3, "Enter a subject.").max(150) });
type Quote = z.infer<typeof quoteSchema>;
type Contact = z.infer<typeof contactSchema>;

function Field<T extends FieldValues>({ label, name, register, error, required = false, type = "text", placeholder = "", min }: { label: string; name: Path<T>; register: UseFormRegister<T>; error?: string; required?: boolean; type?: string; placeholder?: string; min?: number }) {
  return <label className="form-field"><span>{label}{required && <i> *</i>}</span><input type={type} min={min} placeholder={placeholder} aria-invalid={!!error} {...register(name)}/>{error && <small className="field-error">{error}</small>}</label>;
}

function FormStatus({ state }: { state: "idle" | "loading" | "success" | "error" }) {
  if (state === "success") return <div className="form-status success"><CheckCircle2 size={18}/> Your message was received. Our team will follow up using the details you provided.</div>;
  if (state === "error") return <div className="form-status error" role="alert">We could not submit this request right now. Please try again later or contact the company through its verified channels.</div>;
  return null;
}

export function QuoteForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Quote>({ resolver: zodResolver(quoteSchema), defaultValues: { service_type: "" } });
  async function submit(values: Quote) { setState("loading"); try { const res = await fetch("/api/quote-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); if (!res.ok) throw new Error(); setState("success"); } catch { setState("error"); } }
  return <form className="form-card" onSubmit={handleSubmit(submit)} noValidate><FormStatus state={state}/><div className="form-grid"><Field label="Full name" name="name" register={register} error={errors.name?.message as string} required/><Field label="Company name" name="company_name" register={register} error={errors.company_name?.message as string} required/><Field label="Work email" name="email" register={register} error={errors.email?.message as string} required type="email"/><Field label="Phone number" name="phone" register={register} error={errors.phone?.message as string} required/><Field label="Origin country" name="origin_country" register={register} error={errors.origin_country?.message as string} required/><Field label="Origin city" name="origin_city" register={register} error={errors.origin_city?.message as string} required/><Field label="Destination country" name="destination_country" register={register} error={errors.destination_country?.message as string} required/><Field label="Destination city" name="destination_city" register={register} error={errors.destination_city?.message as string} required/>
    <label className="form-field"><span>Service required <i>*</i></span><select {...register("service_type")} aria-invalid={!!errors.service_type}><option value="">Select a service</option>{["Sea Freight", "Air Freight", "Land Transportation", "Customs Clearance", "Warehousing & 3PL", "Project Logistics", "Heavy-Lift Cargo", "Door-to-Door Logistics"].map(x => <option key={x}>{x}</option>)}</select>{errors.service_type && <small className="field-error">{errors.service_type.message}</small>}</label>
    <Field label="Cargo type" name="cargo_type" register={register} error={errors.cargo_type?.message as string} required placeholder="e.g. palletized goods"/><Field label="Approximate weight (kg)" name="cargo_weight" register={register} type="number" min={0} placeholder="Optional"/><Field label="Approximate volume (m³)" name="cargo_volume" register={register} type="number" min={0} placeholder="Optional"/><Field label="Preferred shipping date" name="preferred_shipping_date" register={register} type="date"/><label className="form-field form-wide"><span>Additional requirements <i>*</i></span><textarea rows={4} {...register("message")} placeholder="Share dimensions, handling needs, timelines, or any other useful details." aria-invalid={!!errors.message}/>{errors.message && <small className="field-error">{errors.message.message}</small>}</label>
    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register("website")}/></label></div><div className="form-submit"><p>Fields marked * are required. Your details are used to respond to this request.</p><button className="button button-orange" disabled={isSubmitting || state === "loading"}>{state === "loading" ? <LoaderCircle size={16} className="animate-spin"/> : <>Send quote request <ArrowRight size={16}/></>}</button></div></form>;
}

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Contact>({ resolver: zodResolver(contactSchema) });
  async function submit(values: Contact) { setState("loading"); try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); if (!res.ok) throw new Error(); setState("success"); } catch { setState("error"); } }
  return <form className="form-card" onSubmit={handleSubmit(submit)} noValidate><FormStatus state={state}/><div className="form-grid"><Field label="Full name" name="name" register={register} error={errors.name?.message as string} required/><Field label="Work email" name="email" register={register} error={errors.email?.message as string} required type="email"/><Field label="Phone number" name="phone" register={register} error={errors.phone?.message as string}/><Field label="Company name" name="company_name" register={register}/><Field label="Subject" name="subject" register={register} error={errors.subject?.message as string} required/><label className="form-field form-wide"><span>How can we help? <i>*</i></span><textarea rows={6} {...register("message")} placeholder="Tell us what you would like to discuss." aria-invalid={!!errors.message}/>{errors.message && <small className="field-error">{errors.message.message}</small>}</label><label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register("website")}/></label></div><div className="form-submit"><p>We’ll use your details only to respond to your message.</p><button className="button button-orange" disabled={isSubmitting || state === "loading"}>{state === "loading" ? <LoaderCircle size={16} className="animate-spin"/> : <>Send message <ArrowRight size={16}/></>}</button></div></form>;
}
