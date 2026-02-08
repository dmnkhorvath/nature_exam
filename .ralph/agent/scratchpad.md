# Scratchpad - Add Latin Category Page

## Objective
Replicate the commit from csumpi_exam repo that adds Latin as a separate category page.

## Understanding from reference commit
The commit (7a7d0746ff17ba5672b70c64b5f661b449495edd) did:
1. Created `scripts/extract_latin_questions.py` - filters questions containing 'latin' (case-insensitive)
2. Generated `public/categories/latin.json` - 434 questions with latin terminology
3. Modified `src/helpers/categories.js` - added LATIN category entry

## Current repo structure
- Questions: `public/questions.json`, `public/questions_with_similarity.json`
- Scripts: Python scripts in `scripts/` directory
- Source: JSX files in `src/` with pages and helpers subdirectories
- No `src/helpers/categories.js` exists yet - need to check App.jsx/routing structure

## Analysis Complete
The reference repo has a full category system:
- **HomePage.jsx**: Displays category buttons using Categories object
- **CategoryPage.jsx**: Dynamic route `/category/:categoryName` that loads category JSON files
- **categories.js**: Exports Categories object with all category definitions
- **Category JSON files**: Format is `{ category_name: string, groups: [[q1, q2], [q3], ...] }`

Current nature_exam repo:
- Homepage shows similarity groups from questions_with_similarity.json
- No category system exists yet
- Need to replicate the full category infrastructure

## Implementation Complete ✓

All tasks completed:
1. ✓ Created scripts/extract_latin_questions.py - filters questions containing 'latin' (case-insensitive)
2. ✓ Generated public/categories/latin.json - found 27 questions with latin terminology
3. ✓ Created src/helpers/categories.js - exports Categories object with LATIN entry
4. ✓ Created src/pages/CategoryPage.jsx - dynamic route handler for category display
5. ✓ Updated src/App.jsx - added /category/:categoryName route
6. ✓ Updated src/pages/HomePage.jsx - now shows category selection instead of question list
7. ✓ Build verified - npm run build successful

The Latin category is now accessible at /category/latin with 27 questions filtered from the main question set.

## Final Verification ✓

- Build: ✓ Successful (939ms)
- Tasks: ✓ No open tasks remaining
- Files verified:
  - scripts/extract_latin_questions.py ✓
  - public/categories/latin.json ✓ (27 questions)
  - src/helpers/categories.js ✓
  - src/pages/CategoryPage.jsx ✓
  - src/App.jsx ✓ (with category route)
  - src/pages/HomePage.jsx ✓ (category selection)

All implementation complete. Latin category is now a separate page accessible at /category/latin.
