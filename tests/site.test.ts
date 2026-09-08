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
    expect(html).toContain('8300 SW 65th Ave');
    expect(html).toContain('Miami, FL 33143');
    expect(html).toContain('mailto:bill@bizmaxinc.com');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
    expect(html).toContain('Your business is hiding profit.');
  });

  it('ensures hero CTA buttons are clickable and not obscured by the hero image', () => {
    const html = read('index.html');
    const heroContentMatch = html.match(/<header[^>]*id="top"[^>]*>[\s\S]*?<div class="([^"]*max-w-\[1100px\][^"]*)"/);
    expect(heroContentMatch, 'hero content container').not.toBeNull();
    expect(heroContentMatch![1]).toContain('z-10');

    const heroImageMatch = html.match(/<div class="([^"]*\[animation-delay:450ms\][^"]*sm:-mx-6[^"]*)"/);
    expect(heroImageMatch, 'hero image wrapper').not.toBeNull();
    expect(heroImageMatch![1]).toContain('pointer-events-none');
  });

  it('every page has canonical, Open Graph, and valid Organization schema', () => {
    for (const [file, url] of [
      ['index.html', 'https://bizmaxinc.com/'],
      ['privacy.html', 'https://bizmaxinc.com/privacy'],
      ['terms.html', 'https://bizmaxinc.com/terms'],
    ]) {
      const html = read(file);
      expect(html, file).toContain(`<link rel="canonical" href="${url}">`);
      expect(html, file).toContain(`property="og:url" content="${url}"`);
      expect(html, file).toContain('property="og:image" content="https://bizmaxinc.com/og.png"');
      expect(html, file).not.toContain('name="robots"');
      const ld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      expect(ld, `${file} JSON-LD`).not.toBeNull();
      const org = JSON.parse(ld![1]);
      expect(org['@type']).toBe('Organization');
      expect(org.name).toBe('Business Maximization Inc');
      expect(org.email).toBe('bill@bizmaxinc.com');
      expect(org.address.postalCode).toBe('33143');
    }
    expect(existsSync(join(client, 'og.png'))).toBe(true);
  });

  it('omits the Meta domain-verification tag until the code is configured', () => {
    // PUBLIC_META_DOMAIN_VERIFICATION is unset in the test build.
    expect(read('index.html')).not.toContain('facebook-domain-verification');
  });

  it('keeps header, main, and footer as sibling landmarks on every page', () => {
    for (const file of ['index.html', 'privacy.html', 'terms.html', '404.html']) {
      const html = read(file);
      const main = html.match(/<main[\s>](.*?)<\/main>/s);
      expect(main, `${file} main`).not.toBeNull();
      expect(main![1], `${file}: footer inside main`).not.toContain('<footer');
      expect(main![1], `${file}: header inside main`).not.toContain('<header');
      expect(html.indexOf('<footer'), `${file}: footer after main`).toBeGreaterThan(html.indexOf('</main>'));
    }
    for (const file of ['index.html', 'privacy.html', 'terms.html']) {
      const html = read(file);
      expect(html.indexOf('<header'), `${file}: header before main`).toBeLessThan(html.indexOf('<main'));
    }
  });

  it('keeps the 404 page out of the index with no canonical or social tags', () => {
    const notFound = read('404.html');
    expect(notFound).toContain('<meta name="robots" content="noindex">');
    expect(notFound).not.toContain('rel="canonical"');
    expect(notFound).not.toContain('property="og:');
    expect(notFound).not.toContain('name="twitter:');
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
