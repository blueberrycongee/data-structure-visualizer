#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import html
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE_ROOT = os.path.abspath(os.path.join(ROOT, os.pardir))

MD_URL = (
    "https://raw.githubusercontent.com/blueberrycongee/data-structure-visualizer/main/%E5%A4%A7%E5%AD%A6%E8%87%AA%E8%BF%B0.md"
)

ABOUT_TEMPLATE = os.path.join(SITE_ROOT, "about", "index.html")
DIARY_INDEX = os.path.join(ROOT, "index.html")


def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_text(path: str, content: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def fetch_markdown(url: str) -> str:
    with urllib.request.urlopen(url) as resp:
        data = resp.read()
    return data.decode("utf-8", errors="replace")


def parse_index_targets(index_html: str) -> list:
    targets = re.findall(r"href=\"\.\/entry\.html\?h=([^\"]+)\"", index_html)
    return [html.unescape(t).strip() for t in targets]


def find_section_bounds(md: str, target: str):
    lines = md.splitlines()
    start = -1
    t = target.strip()
    for i, raw in enumerate(lines):
        line = raw.strip()
        if line.startswith("#### "):
            heading = line[5:].strip()
            if heading == t or heading.startswith(t):
                start = i
                break
        else:
            if i < 5 and (line == t or line.startswith(t)):
                start = i
                break
    if start == -1:
        return 0, len(lines)
    end = len(lines)
    for j in range(start + 1, len(lines)):
        line = lines[j].strip()
        if line.startswith("#### "):
            end = j
            break
    return start, end


def slugify(title: str) -> str:
    s = title.strip()
    s = re.sub(r"\s+", "-", s)
    s = s.replace(":", "-")
    s = re.sub(r"[^\w\-\.\u4e00-\u9fa5\u3000-\u303f]", "", s)
    s = re.sub(r"-+", "-", s)
    return s


def escape_script_end(s: str) -> str:
    return s.replace("</script>", "</scr" "+" "ipt>")


def render_html(base_html: str, page_title: str, md_slice: str) -> str:
    base_html = re.sub(
        r"<title>.*?</title>",
        f"<title>大学自述 · {html.escape(page_title)} | hecode🍓🥝</title>",
        base_html,
        count=1,
        flags=re.S,
    )

    base_html = re.sub(
        r"(<div id=\"page-site-info\">\s*<h1 id=\"site-title\">)(.*?)(</h1>)",
        rf"\1大学自述 · {html.escape(page_title)}\3",
        base_html,
        count=1,
        flags=re.S,
    )

    ac_pattern = r"(<div id=\"article-container\">)(.*?)(</div></div>)"
    md_block = escape_script_end(md_slice)
    replacement = (
        "<div id=\"article-container\"></div>"
        "<script id=\"md\" type=\"text/markdown\">" + md_block + "</script>"
        "<script src=\"https://cdn.jsdelivr.net/npm/marked/marked.min.js\"></script>"
        "<script>document.getElementById('article-container').innerHTML = marked.parse(document.getElementById('md').textContent);</script>"
    )
    base_html = re.sub(ac_pattern, rf"\1{replacement}\3", base_html, count=1, flags=re.S)
    return base_html


def main():
    print("[generate] start")
    index_html = read_text(DIARY_INDEX)
    targets = parse_index_targets(index_html)
    if not targets:
        raise RuntimeError("未在 diary/index.html 中找到任何条目链接")
    print(f"[generate] targets: {len(targets)}")
    md = fetch_markdown(MD_URL)
    base_tpl = read_text(ABOUT_TEMPLATE)
    for t in targets:
        start, end = find_section_bounds(md, t)
        lines = md.splitlines()
        slice_text = "\n".join(lines[start:end]).strip()
        html_out = render_html(base_tpl, t, slice_text)
        out_path = os.path.join(ROOT, f"{slugify(t)}.html")
        write_text(out_path, html_out)
        print(f"[generate] wrote {out_path}")

    def repl(m):
        h_val = html.unescape(m.group(1)).strip()
        return f'href="./{slugify(h_val)}.html"'
    new_index = re.sub(r'href="\.\/entry\.html\?h=([^\"]+)"', repl, index_html)
    write_text(DIARY_INDEX, new_index)
    print("[generate] index updated")
    print("[generate] done")


if __name__ == "__main__":
    main()