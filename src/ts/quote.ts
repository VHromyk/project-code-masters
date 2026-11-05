import http from '../api/http';
import { API_URL } from '../api/config/endpoints';

const STORAGE_KEY = 'quote';

const DEFAULT_QUOTE = {
  author: 'Tom Brady',
  quote:
    'A lot of times I find that people who are blessed with the most talent don’t ever develop that attitude, and the ones who aren’t blessed in that way are the most competitive and have the biggest heart.',
};

interface QuoteResponse {
  author: string;
  quote: string;
}

interface StoredQuote extends QuoteResponse {
  date: string;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getQuote(): Promise<QuoteResponse> {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    const stored: StoredQuote = JSON.parse(raw);
    if (stored.date === getTodayDate()) {
      return { author: stored.author, quote: stored.quote };
    }
  }

  const { data } = await http.get<QuoteResponse>(API_URL.quote);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: getTodayDate(), ...data })
  );

  return data;
}

function applyPageModifier(): void {
  const section = document.getElementById('quote-section');
  if (!section) return;

  const isHome =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '/';

  section.classList.add(
    isHome ? 'quote-section--home' : 'quote-section--favorites'
  );

  if (!isHome) {
    const source = section.querySelector<HTMLSourceElement>('.quote-section__source--lg');
    if (source) {
      source.srcset =
        './img/quote-photo-favorites-desktop@1x.jpg 1x, ./img/quote-photo-favorites-desktop@2x.jpg 2x';
    }

    const img = section.querySelector<HTMLImageElement>('.quote-section__image');
    if (img) {
      img.src = './img/quote-photo-favorites@1x.jpg';
      img.srcset =
        './img/quote-photo-favorites@1x.jpg 1x, ./img/quote-photo-favorites@2x.jpg 2x';
    }

    const iconUse = section.querySelector<SVGUseElement>(
      '.quote-section__stats-icon use'
    );
    if (iconUse) {
      iconUse.setAttribute('href', './img/sprite.svg#dumbbell-favorites');
    }

    const iconSvg = section.querySelector<SVGElement>(
      '.quote-section__stats-icon'
    );
    if (iconSvg) {
      iconSvg.setAttribute('width', '20');
      iconSvg.setAttribute('height', '20');
    }
  }
}

function renderQuoteData({ author, quote }: QuoteResponse): void {
  const textEl = document.querySelector<HTMLElement>('.quote__text');
  const authorEl = document.querySelector<HTMLElement>('.quote__author');
  if (textEl) textEl.textContent = quote;
  if (authorEl) authorEl.textContent = author;
}

async function renderQuote(): Promise<void> {
  try {
    renderQuoteData(await getQuote());
  } catch {
    renderQuoteData(DEFAULT_QUOTE);
  }
}

applyPageModifier();
renderQuote();
