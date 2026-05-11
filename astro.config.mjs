// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://uaa-plasma-lab.github.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
