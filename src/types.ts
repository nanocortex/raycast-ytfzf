export type Video = {
    ID: string;
    scraper: string;
    url: string;
    title: string;
    channel: string;
    thumbs: string;
    duration: string;
    views: string;
    date: string;
    description: string;
};

export interface Preferences {
    resultCount: number;
}
