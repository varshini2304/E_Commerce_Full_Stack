import { FormEvent, useMemo, useState } from "react";
import { ContactFormValues } from "../types/contactTypes";
import ErrorMessage from "./ErrorMessage";

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = ({ onSubmit, isSubmitting }: ContactFormProps) => {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  const canSubmit = useMemo(
    () => values.name.trim() && values.email.trim() && values.message.trim(),
    [values],
  );

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (values.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
  };

  return (
    <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-[#2b3869]">Send Us a Message</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-[#4f5b87]" htmlFor="contact-name">
            Name
          </label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-[#d8def7] px-3 text-sm text-[#2f3d70] outline-none focus:border-[#4f69cd]"
            id="contact-name"
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            value={values.name}
          />
          {errors.name ? <ErrorMessage message={errors.name} /> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-[#4f5b87]" htmlFor="contact-email">
            Email
          </label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-[#d8def7] px-3 text-sm text-[#2f3d70] outline-none focus:border-[#4f69cd]"
            id="contact-email"
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            type="email"
            value={values.email}
          />
          {errors.email ? <ErrorMessage message={errors.email} /> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-[#4f5b87]" htmlFor="contact-message">
            Message
          </label>
          <textarea
            className="mt-1 min-h-32 w-full rounded-xl border border-[#d8def7] px-3 py-2 text-sm text-[#2f3d70] outline-none focus:border-[#4f69cd]"
            id="contact-message"
            onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
            value={values.message}
          />
          {errors.message ? <ErrorMessage message={errors.message} /> : null}
        </div>

        <button
          className="h-11 rounded-xl bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!canSubmit || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
