// @ts-ignore
import README from "./README.md" with { type: "text" };

const PATH = "snippets/snippets.code-snippets";

// @ts-ignore
const snippets = await Bun.file(PATH).text();

const groups = snippets.split("//");

groups.shift(); // Remove the unused file header

// Remove last trailing closing bracket
groups[groups.length - 1] = groups[groups.length - 1].replace(/}[ \n\t]+$/d, "");

let content = "";

groups.forEach((group) => {
    const groupName = group.split("\n")[0].trim();

    content += `### ${groupName}\n| Prefix | Description |\n|--------|-------------|`;

    group = group.split("\n").slice(1).join("\n");

    group = group.replace(/,[ \n\t]+$/d, ""); // Remove trailing commas

    const groupContent = JSON.parse(`{${group}}`);

    type Snippet = {
        prefix: string | string[];
        description: string;
    }

    // @ts-ignore
    Object.values(groupContent).forEach((snippet: Snippet) => {
        if (Array.isArray(snippet.prefix))
            snippet.prefix = snippet.prefix.map((prefix) => `\`${prefix}\``).join(", ");
        else
            snippet.prefix = "`" + snippet.prefix + "`";
        content += `\n| ${snippet.prefix} | ${snippet.description} |`;
    });
    
    content += "\n\n";
});

await Bun.write("./README.md", README.replace(/## Snippets.*?\n## /s, `## Snippets\n\n${content}## `));

