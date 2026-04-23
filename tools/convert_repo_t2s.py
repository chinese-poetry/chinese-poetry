#!/usr/bin/env python3
"""Convert Traditional Chinese text in tracked repository files to Simplified Chinese.

Dictionary source:
- tools/TCFontCreator/main/datas/TSPhrases.txt
- tools/TCFontCreator/main/datas/Chars_ts.txt
"""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

END = "\0"


def parse_opencc_table(path: Path) -> dict[str, str]:
    table: dict[str, str] = {}
    with path.open("r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.split("#", 1)[0].strip()
            if not line or "\t" not in line:
                continue
            # Match TCFontCreator logic: keep only the first whitespace-separated segment.
            line = line.split(" ", 1)[0]
            source, target = line.split("\t", 1)
            source = source.strip()
            target = target.strip()
            if source and target and source != target:
                table[source] = target
    return table


def build_trie(phrases: dict[str, str]) -> dict[str, dict]:
    root: dict[str, dict] = {}
    for source, target in phrases.items():
        node = root
        for ch in source:
            node = node.setdefault(ch, {})
        node[END] = target
    return root


class T2SConverter:
    def __init__(self, chars_table: Path, phrases_table: Path) -> None:
        raw_chars = parse_opencc_table(chars_table)
        self.char_map = {
            source: target
            for source, target in raw_chars.items()
            if len(source) == 1 and len(target) == 1
        }
        self.phrase_map = parse_opencc_table(phrases_table)
        self.trie = build_trie(self.phrase_map)

    def convert(self, text: str) -> str:
        out: list[str] = []
        i = 0
        text_len = len(text)

        while i < text_len:
            node = self.trie.get(text[i])
            if node is None:
                ch = text[i]
                out.append(self.char_map.get(ch, ch))
                i += 1
                continue

            best_target = node.get(END)
            best_len = 1 if best_target is not None else 0

            j = i + 1
            cursor = node
            while j < text_len:
                nxt = cursor.get(text[j])
                if nxt is None:
                    break
                cursor = nxt
                j += 1
                target = cursor.get(END)
                if target is not None:
                    best_target = target
                    best_len = j - i

            if best_target is not None:
                out.append(best_target)
                i += best_len
            else:
                ch = text[i]
                out.append(self.char_map.get(ch, ch))
                i += 1

        return "".join(out)


def iter_tracked_files(repo_root: Path) -> list[tuple[str, Path]]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=repo_root,
        check=True,
        capture_output=True,
    )
    files: list[tuple[str, Path]] = []
    for raw in result.stdout.split(b"\0"):
        if not raw:
            continue
        rel = raw.decode("utf-8")
        abs_path = repo_root / rel
        if abs_path.is_file():
            files.append((rel, abs_path))
    return files


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert Traditional Chinese to Simplified Chinese in tracked text files."
    )
    parser.add_argument(
        "--repo-root",
        default=str(Path(__file__).resolve().parents[1]),
        help="Repository root path (default: current repository root).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show how many files would change without writing files.",
    )
    parser.add_argument(
        "--print-files",
        action="store_true",
        help="Print each changed file path.",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    data_dir = repo_root / "tools" / "TCFontCreator" / "main" / "datas"
    chars_path = data_dir / "Chars_ts.txt"
    phrases_path = data_dir / "TSPhrases.txt"

    if not chars_path.is_file() or not phrases_path.is_file():
        raise FileNotFoundError(
            "TCFontCreator dictionary files not found. "
            "Expected: tools/TCFontCreator/main/datas/Chars_ts.txt and TSPhrases.txt"
        )

    converter = T2SConverter(chars_path, phrases_path)
    files = iter_tracked_files(repo_root)

    checked = 0
    changed = 0
    skipped_binary = 0
    skipped_non_utf8 = 0

    for rel, path in files:
        checked += 1
        data = path.read_bytes()

        if b"\0" in data:
            skipped_binary += 1
            continue

        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            skipped_non_utf8 += 1
            continue

        converted = converter.convert(text)
        if converted != text:
            changed += 1
            if args.print_files:
                print(rel)
            if not args.dry_run:
                path.write_bytes(converted.encode("utf-8"))

    mode = "DRY RUN" if args.dry_run else "DONE"
    print(
        f"[{mode}] checked={checked} changed={changed} "
        f"skipped_binary={skipped_binary} skipped_non_utf8={skipped_non_utf8}"
    )


if __name__ == "__main__":
    main()
