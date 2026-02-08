# Memories

## Patterns

### mem-1770551167-c6c6
> HomePage restored: combines category navigation (Categories helper) with original question list + search bar. Search filters by question_text and correct_answer. CategoryPage remains separate for focused category study.
<!-- tags: react, homepage, search | created: 2026-02-08 -->

### mem-1770550839-b972
> Added category system to nature_exam: CategoryPage.jsx uses dynamic routing /category/:categoryName, loads JSON from /categories/{file}, uses Categories helper for config
<!-- tags: routing, react | created: 2026-02-08 -->

## Decisions

## Fixes

### mem-1770551265-f080
> HomePage already contains search bar and all questions - commit 3c4b2c2 restored functionality. User issue was likely browser cache needing refresh.
<!-- tags: homepage, browser-cache | created: 2026-02-08 -->

## Context

### mem-1770550841-126c
> Latin extraction script uses questions_with_similarity.json (not categorized_questions_with_similarity.json) - this repo has different file naming
<!-- tags: data, nature_exam | created: 2026-02-08 -->
