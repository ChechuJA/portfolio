# Copilot Instructions — Comic Illustrator Portfolio

## Project purpose

This repository contains a static portfolio website for a comic illustrator hosted on GitHub Pages.

The site must remain:

* static
* simple to maintain
* editable without programming knowledge
* fast and lightweight

The illustrator must only edit JSON files and add images.
No manual HTML editing should be required to publish new content.

---

## Technical constraints (VERY IMPORTANT)

Copilot must ALWAYS respect these rules:

* Use only HTML, CSS and vanilla JavaScript
* Never introduce frameworks (React, Vue, Angular, Svelte, etc.)
* Never introduce build tools (Webpack, Vite, npm dependencies)
* The site must run by opening index.html locally
* Must remain compatible with GitHub Pages static hosting
* Avoid external dependencies and CDNs when possible
* Keep code readable and well commented

If a requested feature requires backend or database → propose a static alternative instead.

---

## Data driven architecture

All dynamic content must come from JSON files inside `/data`.

Content editors (non developers) will only modify:

* /data/artworks.json
* /data/posts.json
* /data/products.json
* /data/chatbot.json (for chatbot responses)

Copilot should always prefer:
JSON update > HTML modification

Never hardcode artworks into HTML.

---

## Chatbot Assistant

The portfolio includes a static chatbot assistant (ArtBot) that helps visitors:

* Answer common questions about commissions, tools, and process
* Provide contact information
* Guide users to relevant sections
* No backend required - uses keyword matching from chatbot.json

**Important:**
* All responses stored in /data/chatbot.json
* Keyword-based matching (no AI/API required)
* Easy to update responses without code changes
* Simulated typing delay for natural feel
* Mobile responsive with fullscreen mode

**To add new responses:**
Edit `/data/chatbot.json` and add new entries with keywords and answers.

---

## File structure rules

* Images stored inside `/assets/`
* Data inside `/data/`
* Scripts inside `/js/`
* Styles inside `/css/`

Do not reorganize folders unless strictly necessary.

---

## UI principles

This is an artwork-first website.

Priorities:

1. Artwork visibility
2. Fast loading
3. Mobile usability
4. Accessibility
5. Simple navigation

Avoid heavy visual effects or complex UI components.

---

## Performance rules

* Use lazy loading for images
* Optimize image sizes via HTML attributes
* Avoid large libraries
* Minimize DOM complexity
* Prefer CSS over JavaScript animations

---

## SEO and metadata

Artwork pages must dynamically generate:

* title
* description
* open graph tags

Based on JSON data.

---

## When adding features

Before writing code, Copilot should:

1. Check if it can be solved with existing structure
2. Prefer extending JSON schema
3. Avoid breaking current URLs
4. Keep backward compatibility

---

## Typical tasks Copilot should help with

* Adding new filters in gallery
* Extending artwork metadata
* Improving accessibility
* Performance improvements
* UI refinements
* Static store enhancements

---

## Forbidden changes

* No backend APIs
* No login systems
* No server side rendering
* No databases
* No authentication
* No heavy frameworks

If user asks for those → propose static workaround.

---

## Goal mindset

This project is not a tech demo.
It is a long term personal workshop used by non programmers.

Stability > complexity
Simplicity > cleverness
Maintainability > features