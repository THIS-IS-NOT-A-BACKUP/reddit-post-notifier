const $ = document.querySelector.bind(document);

let elements = null;

function getElements() {
    if (!elements) {
        elements = {
            mainContainer: $('main'),
            header: $('header'),
            headerBackBtn: $('header button.arrow-left'),
            headerSubredditLink: $('header a.subreddit-name'),
            footer: $('footer'),
        };
    }
    return elements;
}

export default getElements;
