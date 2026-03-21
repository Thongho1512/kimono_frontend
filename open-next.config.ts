import type { OpenNextConfig } from "@opennextjs/cloudflare";

/** @type {import('@opennextjs/cloudflare').OpenNextConfig} */
const config: OpenNextConfig = {
  default: {
    runtime: "cloudflare",
  },
};

export default config;
