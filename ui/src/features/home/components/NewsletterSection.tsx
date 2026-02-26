import { Button } from "../../../shared/components";
import { UI_MESSAGES } from "../../../shared/constants/config";
import { NewsletterData, SectionHeaderContent } from "../../../types/home";

interface NewsletterSectionProps {
  header: SectionHeaderContent;
  data: NewsletterData;
}

const NewsletterSection = ({ header, data }: NewsletterSectionProps) => (
  <section className="bg-gradient-to-r from-[#a3a7ef] via-[#b9bbf5] to-[#caccf9] px-6 py-10 sm:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold text-white sm:text-4xl">{header.title}</h2>
      <p className="mt-3 text-sm text-white/85 sm:text-base">
        {header.subtitle ?? data.description}
      </p>
      <form
        action={data.actionUrl}
        className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
        method={data.method ?? "post"}
      >
        <input
          className="h-11 flex-1 rounded-full border border-white/40 bg-white/95 px-4 text-sm text-[#243367] placeholder:text-[#96a1c8] focus:border-white focus:outline-none"
          name="email"
          placeholder={data.emailPlaceholder}
          required
          type={UI_MESSAGES.newsletterEmailType}
        />
        <Button type="submit">{data.submitLabel}</Button>
      </form>
      {data.disclaimer ? (
        <p className="mt-3 text-xs text-white/75">{data.disclaimer}</p>
      ) : null}
    </div>
  </section>
);

export default NewsletterSection;
