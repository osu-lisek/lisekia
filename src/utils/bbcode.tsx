import sizeof from "image-size";
import xss from "xss";

export class BBCodeParser {
    private tagHandlers: { [tagName: string]: TagHandler } = {};

    constructor() {
        // Add some basic default tags
        this.registerTag('b', { render: async (text) => `<strong>${text}</strong>` });
        this.registerTag('i', { render: async (text) => `<em>${text}</em>` });
        this.registerTag('u', { render: async (text) => `<u>${text}</em>` });
        this.registerTag('url', {
            render: async (text, url) =>
                `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        });
        
        this.registerTag('img', { render: async (text) => handleImageMap(text) });
        this.registerTag('imagemap', { render: (text) => handleImageMap(text) })
    }

    registerTag(tagName: string, handler: TagHandler) {
        this.tagHandlers[tagName.toLowerCase()] = handler;
    }

    async parse(input: string): Promise<string> {
        const regex = /\[(\w+)(?:=([^\]]+))?\](.*?)\[\/\1\]/gs;
        let match;

        while ((match = regex.exec(input)) !== null) {
            const tagName = match[1].toLowerCase();
            const tagAttribute = match[2];
            const tagContent = match[3];

            const handler = this.tagHandlers[tagName];
            if (handler) {
                input = input.replace(match[0], await handler.render(tagContent, tagAttribute));
            } else {
                // Handle unknown tags (you might want to remove them)
            }
        }

        return xss(input, {
            whiteList: {
                'img': ["src", "alt", "title", "width", "height"],
                'a': ["href", "target", "rel"],
                'div': ['style']
            }
        });
    }
}

interface TagHandler {
    render(text: string, attribute?: string): Promise<string>;
}

const handleImage = async (text: string) => {

    let imageData = Buffer.from(await fetch(text).then(res => res.arrayBuffer()).catch(err => new ArrayBuffer(0)));
    let size = sizeof(imageData);

    return `<img src="/_next/image?url=${encodeURIComponent(text)}&q=75&w=${size.width}&h=${size.height}">`;
}

const handleImageMap = async (text: string) => {
    let data = text.split("\n").map(c => c.trim()).filter(c => c);
    let image = data[0];
    let imageData = Buffer.from(await fetch(image).then(res => res.arrayBuffer()));
    let size = sizeof(imageData);
    let result = `<div style="position:relative; width: ${size.width}px; height: ${size.height}px">`

    result += `<img src="${image}">`

    for (let i = 1; i < data.length; i++) {
        let line: String = data[i];
        let params: Array<string> = line.split(" ");
        let x = params[0];
        let y = params[1];
        let width = params[2];
        let height = params[3];

        let is_tooltip = params[4] == "#";

        if (is_tooltip) {
            let tooltip_text = params.slice(5).join(" ");
            result += `<div style="position:absolute; left:${x}; top:${y}; width:${width}; height:${height};" data-tooltip="true" title=${tooltip_text}>${tooltip_text}</div>`;
        }else {
            let url = params[4];
            let title = params.length > 5 ? params.slice(5).join(" ") : "";

            result += `<a style="position:absolute; left:${x}%; top:${y}%; width:${width}%; height:${height}%; z-index: 2;" href="${url}" title="${title}" target="_blank"></a>`
        }

    }

    result += "</div>"
    return result;
}