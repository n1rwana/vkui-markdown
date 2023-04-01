import React from "react";

import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

import '../css/Markdown.css';

class Markdown extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.querySelectorAll('a').forEach((item) => {
            item.addEventListener('click', this.props.onLinkClick);
        });
    }

    render() {
        const { onlyText } = this.props;

        marked.setOptions({
            baseUrl: null,
            breaks: false,
            extensions: null,
            gfm: true,
            headerIds: false,
            headerPrefix: "",
            highlight: null,
            langPrefix: "language-",
            mangle: true,
            pedantic: false,
            renderer: null,
            sanitize: false,
            sanitizer: null,
            silent: false,
            smartLists: false,
            smartypants: false,
            tokenizer: null,
            walkTokens: null,
            xhtml: false
        });

        const renderer = {
            table(thead, tbody) {
                if (onlyText) return "";

                thead = thead.length > 0 && (thead = "<thead>" + thead + "</thead>");
                tbody = tbody.length > 0 && (tbody = "<tbody>" + tbody + "</tbody>");

                return '<div class="MarkdownTableResponsive">\n<table>\n' + thead + "\n" + tbody + "\n</table>\n</div>\n";
            },

            image(src, title, alt) {
                if (onlyText) return "";

                try {
                    src = encodeURI(src).replace(/%25/g, "%");
                } catch (e) {
                    return alt;
                }

                let i = new Image;
                let img = "";

                if (
                    /^(https?:\/\/)?([a-z0-9_\-.]+\.)+userapi\.com\/.+/.test(src) ||
                    /^(https?:\/\/)?([a-z0-9_\-.]+\.)+cloud-apps\.ru\/.+/.test(src) ||
                    /^(https?:\/\/)?vk\.com\/.+/.test(src)
                ) {
                    i.src = src;
                    img = i.outerHTML;
                } else {
                    img = '<div class="MarkdownImagePlaceholder"><svg height="56" viewBox="0 0 56 56" width="56" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h56v56H0z"></path><path d="M20.32 6H36.1c3.73.03 5.68.37 7.57 1.3l.42.21c1.9 1.01 3.39 2.5 4.4 4.4 1.04 1.96 1.45 3.85 1.5 7.58l.01.83V36.5c-.06 3.73-.47 5.62-1.51 7.58a10.59 10.59 0 0 1-4.4 4.4c-1.96 1.04-3.85 1.45-7.58 1.5l-.83.01H19.5c-3.73-.06-5.62-.47-7.58-1.51a10.59 10.59 0 0 1-4.4-4.4c-1.04-1.96-1.45-3.85-1.5-7.58L6 35.68V19.9c.03-3.73.37-5.68 1.3-7.57l.21-.42c1.01-1.9 2.5-3.39 4.4-4.4 1.96-1.04 3.85-1.45 7.58-1.5zm13.16 22.05-9.24 11.02c-.49.58-1.33.7-1.96.3l-.12-.1-5.1-4.09-7.14 7.02.24.48a7.59 7.59 0 0 0 3.16 3.16c1.5.8 2.95 1.12 6.26 1.16H36.42c3.3-.04 4.76-.36 6.26-1.16a7.59 7.59 0 0 0 3.16-3.16c.44-.82.73-1.63.91-2.73zM35.68 9H19.58c-3.3.04-4.76.36-6.26 1.16a7.59 7.59 0 0 0-3.16 3.16c-.86 1.6-1.16 3.16-1.16 7V36.42c.01.92.05 1.7.1 2.37l6.8-6.68a1.5 1.5 0 0 1 1.88-.19l.12.09 4.99 4 9.28-11.07a1.5 1.5 0 0 1 2.03-.25l.12.09L47 36.14V19.58c-.04-3.3-.36-4.76-1.16-6.26a7.59 7.59 0 0 0-3.16-3.16c-1.6-.86-3.16-1.16-7-1.16zM19.5 17a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="currentColor" fill-rule="nonzero"></path></g></svg></div>';
                }

                alt = alt || "";
                if (alt.length > 0) {
                    i.setAttribute("alt", alt);
                    img += '<div class="MarkdownImageBlockHint">' + alt + "</div>";
                }

                title = title || "";
                if (title.length > 0) i.setAttribute("title", title);

                return '<div class="MarkdownImageBlock">' + img + '</div>';
            },

            link(link, title, body) {
                if (null === link) return body;

                let attribute = title ? ' title="' + title + '"' : "";

                if (
                    !/^\/[^/]/.test(link) &&
                    !/^(https?:\/\/)?([a-z0-9_\-.]+\.)+cloud-apps\.ru\/.+/.test(link) &&
                    !/^(https?:\/\/)?localhost:10999\/.+/.test(link)
                ) {
                    attribute += ' rel="noopener" target="_blank"';
                }

                return '<a href="' + link + '"' + attribute + ">" + body + "</a>";
            },

            html() {
                return "";
            }
        };

        marked.use({ renderer });
        return (
            <div
                className="Markdown"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(this.props.children), {
                        ALLOWED_TAGS: onlyText ?
                            ["p", "a", "div", "em", "strong", "del", "blockquote", "code", "pre", "ul", "ol", "li", "br"]
                            :
                            ["p", "a", "div", "h1", "h2", "h3", "h4", "h5", "h6", "em", "strong", "del", "blockquote", "code", "pre", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "img", "svg", "g", "path", "br"]
                    })
                }} />
        );
    }
}

export default Markdown;