import { lazy, Suspense, useState } from "react";
import { AxiosError } from "axios";
import { useHomeData } from "../../home/hooks/useHomeData";
import { useContactForm, useContactInfo } from "../hooks/useContactForm";
import { ContactFormValues } from "../types/contactTypes";
import ContactForm from "./ContactForm";
import ContactInfoCard from "./ContactInfoCard";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import MapSection from "./MapSection";
import SuccessMessage from "./SuccessMessage";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const ContactPage = () => {
  const { data: homeData } = useHomeData();
  const { data, isLoading, isError, refetch } = useContactInfo();
  const mutation = useContactForm();
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleSubmit = async (values: ContactFormValues) => {
    setResultMessage(null);

    const result = await mutation.mutateAsync(values);
    setResultMessage(`Message submitted successfully. Ticket ID: ${result.ticketId}`);
  };

  const mutationError = mutation.error as AxiosError<{ message?: string }> | null;
  const mutationErrorText = mutationError?.response?.data?.message ?? mutationError?.message;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {homeData?.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={homeData.navigation} />
          </Suspense>
        ) : null}

        <main className="space-y-6 bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-8">
          <header className="rounded-2xl border border-[#dfe5fb] bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#2b3869]">Contact Us</h1>
            <p className="mt-2 text-sm text-[#6d78a2]">{data?.subtitle ?? ""}</p>
          </header>

          {isLoading ? <Loader /> : null}

          {isError ? (
            <div className="space-y-3">
              <ErrorMessage message="Failed to load contact details." />
              <button
                className="rounded-lg bg-[#3557c1] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  void refetch();
                }}
                type="button"
              >
                Retry
              </button>
            </div>
          ) : null}

          {data ? (
            <>
              {resultMessage ? <SuccessMessage message={resultMessage} /> : null}
              {mutationErrorText ? <ErrorMessage message={mutationErrorText} /> : null}

              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <ContactForm isSubmitting={mutation.isPending} onSubmit={handleSubmit} />
                <ContactInfoCard info={data} />
              </div>

              <MapSection mapEmbedUrl={data.mapEmbedUrl} />
            </>
          ) : null}
        </main>

        {homeData?.footer ? (
          <Suspense fallback={<Loader />}>
            <SiteFooter data={homeData.footer} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default ContactPage;
