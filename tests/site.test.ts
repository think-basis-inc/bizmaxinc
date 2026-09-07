import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Smoke test over the production build in dist/. Run `npm run build` first.
const client = join(process.cwd(), 'dist', 'client');
const read = (file: string) => readFileSync(join(client, file), 'utf8');

describe('production build', () => {
  it('prerenders every page as a file', () => {
    for (const file of ['index.html', 'privacy.html', 'terms.html', '404.html']) {
      expect(existsSync(join(client, file)), file).toBe(true);
    }
  });

  it('home page carries the business identity Meta checks for', () => {
    const html = read('index.html');
    expect(html).toContain('Business Maximization Inc');
    expect(html).toContain('6800 SW 65th Ave');
    expect(html).toContain('Miami, FL 33143');
    expect(html).toContain('mailto:bill@bizmaxinc.com');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
    expect(html).toContain('Your business is hiding profit.');
  });

  it('home page has canonical, Open Graph, and Organization schema', () => {
    const html = read('index.html');
    expect(html).toContain('<link rel="canonical" href="https://bizmaxinc.com/">');
    expect(html).toContain('property="og:image" content="https://bizmaxinc.com/og.png"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"postalCode":"33143"');
    expect(existsSync(join(client, 'og.png'))).toBe(true);
  });

  it('legal pages disclose advertising data use and contact', () => {
    const privacy = read('privacy.html');
    expect(privacy).toContain('Meta Pixel');
    expect(privacy).toContain('California');
    expect(privacy).toContain('bill@bizmaxinc.com');
    const terms = read('terms.html');
    expect(terms).toContain('Florida');
    expect(terms).toContain('guarantee');
  });

  it('ships robots.txt and a sitemap listing every page', () => {
    expect(read('robots.txt')).toContain('Sitemap: https://bizmaxinc.com/sitemap-index.xml');
    const sitemap = read('sitemap-0.xml');
    for (const url of ['https://bizmaxinc.com', 'https://bizmaxinc.com/privacy', 'https://bizmaxinc.com/terms']) {
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    }
  });
});
