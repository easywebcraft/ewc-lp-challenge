// 挑戦LP（start-lp.easywebcraft.jp）で使っている文字だけを抜き出して woff2 にする。
// Googleフォントの差し替えで開いた瞬間に文字が動く（カクつく）のを防ぐため、LPに同梱する。
// 文言を変えたら、これを再実行して fonts/ を差し替えること（無い文字は仮の書体で出る）。
import subsetFont from "subset-font";
import { readFileSync, writeFileSync } from "fs";
const html = readFileSync("lp.html", "utf8");
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const extra = "・。、「」『』（）！？〜～ー…｜／：％＋＝→↓←↑‹›✓①②③";
const chars = [...new Set(html + ascii + extra)].filter((c) => c.codePointAt(0) >= 32).join("");
console.log("chars", [...chars].length);
const jobs = [
  ["C:/Windows/Fonts/NotoSansJP-VF.ttf", "lp-sans.woff2", { wght: { min: 400, max: 900 } }],
  ["NotoSerifJP-VF.ttf", "lp-serif.woff2", { wght: { min: 600, max: 900 } }],
  ["Oswald-VF.ttf", "lp-num.woff2", { wght: { min: 600, max: 700 } }],
];
for (const [src, out, axes] of jobs) {
  const buf = await subsetFont(readFileSync(src), chars, { targetFormat: "woff2", variationAxes: axes });
  writeFileSync(out, buf);
  console.log(out, Math.round(buf.length / 1024) + "KB");
}
