# Question Processing Scripts

Python scripts for extracting, parsing, and analyzing Hungarian medical exam questions.

## Prerequisites

- [uv](https://github.com/astral-sh/uv) - Fast Python package manager
- Google API key for Gemini (for parsing)

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Set API key
export GOOGLE_API_KEY="your-api-key"
```

Get your API key at: https://aistudio.google.com/apikey

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `extract_questions.py` | Extract question images from PDF files |
| `process_questions.py` | Parse images & retry failed operations (Gemini) |
| `categorize_questions.py` | Merge all parsed.json files into a single JSON |
| `find_similar_questions.py` | Find and group similar questions |

## Workflow

```
PDF Files → extract → Images → parse → JSON → merge → find similarities
```

---

## 1. Extract Questions from PDFs

Extract question images from scanned PDF exam files.

```bash
uv run scripts/extract_questions.py <pdf_or_folder> -o <output_folder>
```

**Example:**
```bash
uv run scripts/extract_questions.py data/scrape/ -o data/extracted_questions/
```

---

## 2. Parse Question Images

Parse extracted images using Google Gemini Vision to extract structured question data.

```bash
uv run scripts/process_questions.py parse <folder_with_images>
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-m, --model` | `gemini-2.0-flash` | Gemini model to use |
| `-fw, --folder-workers` | `5` | Parallel folder workers |
| `-iw, --image-workers` | `10` | Parallel image workers per folder |
| `-l, --log` | `gemini_parser.log` | Log file path |

**Examples:**
```bash
# Basic usage
uv run scripts/process_questions.py parse data/extracted_questions/

# With custom parallelism
uv run scripts/process_questions.py parse data/extracted_questions/ -fw 5 -iw 15

# With different model
uv run scripts/process_questions.py parse data/extracted_questions/ -m gemini-1.5-flash
```

**Output:** Creates `parsed.json` in each subfolder.

---

## 3. Retry Failed Image Parsing

Re-process images that failed during initial parsing.

```bash
uv run scripts/process_questions.py retry-parse
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-f, --failed-file` | `failed_images.json` | File listing failed images |
| `-d, --data-dir` | `data/extracted_questions` | Base directory for images |
| `-m, --model` | `gemini-2.0-flash` | Gemini model |

**Example:**
```bash
uv run scripts/process_questions.py retry-parse -f failed_images.json
```

---

## 4. Merge Parsed Questions

Merge all `parsed.json` files into a single JSON file.

```bash
uv run scripts/categorize_questions.py <extracted_questions_folder> [options]
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-o, --output` | `questions.json` | Output file path |
| `-l, --log` | `merger.log` | Log file path |

**Example:**
```bash
uv run scripts/categorize_questions.py data/extracted_questions/ -o public/questions.json
```

**Output:** `questions.json`

---

## 5. Find Similar Questions

Detect and group similar questions using semantic embeddings.

```bash
uv run scripts/find_similar_questions.py
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `-i, --input` | `public/questions.json` | Input file |
| `-o, --output` | `public/questions_with_similarity.json` | Output file |
| `--cross-encoder-threshold` | `0.7` | Similarity threshold (Stage 1) |
| `--refine-threshold` | `10` | Refine groups larger than this |
| `--no-cross-encoder` | - | Skip cross-encoder (faster) |
| `--no-refine` | - | Skip refinement stage |

**Examples:**
```bash
# Default (recommended)
uv run scripts/find_similar_questions.py

# Stricter grouping
uv run scripts/find_similar_questions.py --cross-encoder-threshold 0.85

# Fast mode
uv run scripts/find_similar_questions.py --no-cross-encoder --no-refine
```

**Output:** Adds `similarity_group_id` field to each question.

See [SIMILARITY_GUIDE.md](SIMILARITY_GUIDE.md) for detailed documentation.

---

## Complete Pipeline Example

```bash
# 1. Set API key
export GOOGLE_API_KEY="your-api-key"

# 2. Extract images from PDFs
uv run scripts/extract_questions.py data/scrape/ -o data/extracted_questions/

# 3. Parse images with Gemini
uv run scripts/process_questions.py parse data/extracted_questions/

# 4. Retry any failures
uv run scripts/process_questions.py retry-parse

# 5. Merge all parsed questions
uv run scripts/categorize_questions.py data/extracted_questions/ -o public/questions.json

# 6. Find similar questions
uv run scripts/find_similar_questions.py
```

---

## Output Files

| File | Location | Description |
|------|----------|-------------|
| `parsed.json` | Each extracted folder | Parsed question data per exam |
| `questions.json` | `public/` | All merged questions |
| `questions_with_similarity.json` | `public/` | With similarity groups |

---

## Troubleshooting

### Rate Limiting (429 errors)
Reduce parallel workers:
```bash
uv run scripts/process_questions.py parse data/extracted_questions/ -fw 2 -iw 5
```

### API Key Issues
Ensure the key is set:
```bash
echo $GOOGLE_API_KEY
```

### Check Failed Items
```bash
# Count failed parsing in a folder
jq '[.[] | select(.success == false)] | length' data/extracted_questions/EMIII_0213/parsed.json
```
