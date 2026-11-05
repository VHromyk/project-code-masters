export interface QuoteResponse {
  author: string;
  quote: string;
}

export interface StoredQuote extends QuoteResponse {
  date: string;
}
