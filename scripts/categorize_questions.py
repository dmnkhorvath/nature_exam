#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.9"
# ///
"""
Question Merger

Merges all parsed.json files from extracted question folders into a single JSON file.

Usage:
    uv run scripts/categorize_questions.py <extracted_questions_folder> [options]
"""

import argparse
import json
import logging
import sys
from pathlib import Path


def setup_logging(log_file: Path) -> logging.Logger:
    """Setup logging to file and console."""
    logger = logging.getLogger("merger")
    logger.setLevel(logging.DEBUG)
    logger.handlers = []

    fh = logging.FileHandler(log_file, mode='w', encoding='utf-8')
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(logging.Formatter('%(message)s'))

    logger.addHandler(fh)
    logger.addHandler(ch)

    return logger


def merge_parsed_files(input_dir: Path, logger: logging.Logger) -> list[dict]:
    """Merge all parsed.json files into a single list."""
    all_questions = []

    parsed_files = sorted(input_dir.glob("**/parsed.json"))
    logger.info(f"Found {len(parsed_files)} parsed.json files")

    for parsed_file in parsed_files:
        folder_name = parsed_file.parent.name
        try:
            with open(parsed_file, 'r', encoding='utf-8') as f:
                questions = json.load(f)

            for q in questions:
                if q.get("success") and q.get("data"):
                    q["source_folder"] = folder_name
                    all_questions.append(q)

            logger.debug(f"Loaded {len(questions)} questions from {folder_name}")
        except Exception as e:
            logger.error(f"Error loading {parsed_file}: {e}")

    logger.info(f"Total questions merged: {len(all_questions)}")
    return all_questions


def main():
    parser = argparse.ArgumentParser(
        description='Merge all parsed.json files into a single JSON file.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s extracted_questions/
  %(prog)s extracted_questions/ -o public/questions.json
        '''
    )

    parser.add_argument('input', type=Path, help='Folder containing parsed.json files')
    parser.add_argument('-o', '--output', type=Path, default=Path('questions.json'),
                        help='Output file (default: questions.json)')
    parser.add_argument('-l', '--log', type=Path, default=Path('merger.log'), help='Log file')

    args = parser.parse_args()

    logger = setup_logging(args.log)

    logger.info(f"Merging parsed.json files from {args.input}")
    questions = merge_parsed_files(args.input, logger)

    if not questions:
        logger.error("No questions found to process")
        sys.exit(1)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

    logger.info(f"Merged {len(questions)} questions saved to {args.output}")


if __name__ == '__main__':
    main()
