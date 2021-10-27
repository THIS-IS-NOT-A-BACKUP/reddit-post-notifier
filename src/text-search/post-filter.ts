import type { TextId } from './index';
import type { RedditPostData } from '../reddit-api/reddit-types';
import type { DocField, DocSearch } from './document';
import { Document } from './document';

export type SearchableFields = keyof Pick<RedditPostData, 'author' | 'title' | 'selftext' | 'link_flair_text'>;
export type SearchableRedditPost = Pick<RedditPostData, SearchableFields> & { id: string | number };

//** Filter out posts that don't fit given search queries */
export function postFilter<T extends SearchableRedditPost>(
    posts: T[],
    queriesLists: DocSearch[][],
    fields: SearchableFields[] = ['author', 'link_flair_text', 'selftext', 'title'],
): T[] {
    const usedFields = fields.map((field) => {
        const result: DocField = { field };
        // match author and flair without stemming and normalization
        if (field === 'author' || field === 'link_flair_text')
            result.options = { normalize: false, stemmer: false, tokenizer: false };
        return result;
    });

    const doc = new Document({ fields: usedFields, id: 'id' });
    posts.forEach((p) => doc.add(p));

    const result = new Set<TextId>();

    for (let i = 0; i < queriesLists.length; i++) {
        const qList = queriesLists[i];
        if (!qList) continue;
        const ids = doc.search(qList);
        ids.forEach((id) => result.add(id));
    }
    return posts.filter((p) => result.has(p.id));
}
