import type { RedditComment, RedditListingResponse, RedditMessage, RedditPost } from '../reddit-types';

const response: RedditListingResponse<RedditPost | RedditMessage | RedditComment> = {
    kind: 'Listing',
    data: { children: [] },
};

export const mockUnread = jest.fn(async () => response);

export const mockNewPosts = jest.fn(async () => response);
export const mockNewSearchPosts = jest.fn(async () => response);
export const mockGetSub = jest.fn(() => ({ new: mockNewPosts, search: mockNewSearchPosts }));

export const mockSearch = jest.fn(async () => response);

const mockUserOverview = jest.fn(async () => response);
const mockUserSubmitted = jest.fn(async () => response);
const mockUserComments = jest.fn(async () => response);
export const mockUser = jest.fn(() => ({
    overview: mockUserOverview,
    comments: mockUserComments,
    submitted: mockUserSubmitted,
}));

const mock = jest.fn().mockImplementation(() => {
    return {
        getSubreddit: mockGetSub,
        search: mockSearch,
        messages: { unread: mockUnread },
        user: mockUser,
    };
});

export default mock;
