// generate-sitemap.js
import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { resolve } from 'path';

const baseUrl = 'https://thinakaranmanokaran.github.io/spotmix-downloader/';

// List of site pages (you can add more later)
const pages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
];

(async () => {
    const sitemapStream = new SitemapStream({ hostname: baseUrl });

    pages.forEach(page => {
        sitemapStream.write({
            url: page.url,
            changefreq: page.changefreq,
            priority: page.priority,
            lastmod: new Date().toISOString().split('T')[0], // auto-update
        });
    });

    sitemapStream.end();

    const sitemapData = await streamToPromise(sitemapStream);
    writeFileSync(resolve('./public/sitemap.xml'), sitemapData.toString());

    console.log('✅ Sitemap generated at public/sitemap.xml');
})();
