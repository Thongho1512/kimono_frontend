import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en", "ja", "ko", "zh"],
  defaultLocale: "vi",
});
