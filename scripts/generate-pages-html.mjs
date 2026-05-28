import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? "dist/client";
const basePath = process.argv[3] ?? "/joy-play-teach/";
const assetsDir = join(outDir, "assets");

const jsFiles = readdirSync(assetsDir).filter((file) => file.startsWith("index-") && file.endsWith(".js"));
const cssFiles = readdirSync(assetsDir).filter((file) => file.startsWith("styles-") && file.endsWith(".css"));

const entryFile = jsFiles.find((file) => readFileSync(join(assetsDir, file), "utf8").includes("hydrateRoot(document")) ?? jsFiles[0];
if (!entryFile) {
  throw new Error("Could not find the client entry bundle in dist/client/assets");
}

const cssFile = cssFiles[0];
const base = basePath.endsWith("/") ? basePath : `${basePath}/`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#ffffff" />
    ${cssFile ? `<link rel="stylesheet" href="${base}assets/${cssFile}" />` : ""}
    <title>Joy Play Teach</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.$_TSR = {
        buffer: [],
        initialized: true,
        router: {
          matches: [],
          lastMatchId: null,
          manifest: {
            routes: {
              "__root__": {},
              "/": {},
              "/day-night": {},
              "/match-letters": {},
            }
          },
          dehydratedData: null,
        },
        h() {},
      };
    </script>
    <script type="module" src="${base}assets/${entryFile}"></script>
  </body>
</html>
`;

writeFileSync(join(outDir, "index.html"), html);
writeFileSync(join(outDir, "404.html"), html);

console.log(`Generated static Pages shell using ${entryFile}${cssFile ? ` and ${cssFile}` : ""}`);
