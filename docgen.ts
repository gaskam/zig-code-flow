// @ts-ignore
let README = await Bun.file("./README.md").text();

const PATH = "snippets/snippets.code-snippets";

// @ts-ignore
const snippets = await Bun.file(PATH).text();

const groups = snippets.split("//");

groups.shift(); // Remove the unused file header

// Remove last trailing closing bracket
groups[groups.length - 1] = groups[groups.length - 1].replace(
    /}[ \n\t]+$/d,
    ""
);

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
    };

    // @ts-ignore
    Object.values(groupContent).forEach((snippet: Snippet) => {
        if (Array.isArray(snippet.prefix))
            snippet.prefix = snippet.prefix
                .map((prefix) => `\`${prefix}\``)
                .join(", ");
        else snippet.prefix = "`" + snippet.prefix + "`";
        content += `\n| ${snippet.prefix} | ${snippet.description} |`;
    });

    content += "\n\n";
});

README = README.replace(/## Snippets.*?\n## /s, `## Snippets\n\n${content}## `);

// @ts-ignore
let titles: string[] = README.match(/^(#.*)/gm);
titles?.splice(0, titles.indexOf("## Table of Contents") + 1);
titles = titles?.map((title) =>
    title.replace("## ", "* ").replaceAll("#", "\t")
);
titles = titles?.map((title) => {
    const name = title.match(/\* (.*)/)?.[1];
    const prefix = title.match(/.*\* /)?.[0];
    return `${prefix}[${name}](#${name?.toLowerCase().replaceAll(" ", "-")})`;
});

README = README.replace(
    /## Table of Contents.*?\n## /s,
    `## Table of Contents\n${titles.join("\n")}\n\n## `
);

Bun.write("./README.md", README);
