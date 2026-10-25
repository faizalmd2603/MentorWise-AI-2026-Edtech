# Project architecture rules

- The visual system uses the official MentorWise AI Midnight Gold palette with Outfit headings and Figtree body text, because all pages should inherit one consistent brand identity.
- Homepage community feedback uses a persistent sliding track with boundary clones and offscreen-paused reading timers, because transitions must preserve spatial continuity without skipping stories.
- Homepage directory listings use stationary verifiable links and a separate decorative motion track, because animation must not make badges difficult to click or duplicate verification links.
- Agent chats are saved per user (chat_threads/chat_messages) and the server rebuilds history from the database, so the client sends only the newest message and memory survives reloads and devices.
- Web search rewrites the question into a short keyword query with conversation context and filters off-topic results, because raw chatty questions return unrelated Google hits.
- Resume text is rendered through shared paragraph/bullet parsing in src/lib/resume-format.ts, because collapsing newlines merged summaries into one paragraph.
- Lovable email callbacks under /lovable/* bypass app-level redirects and authenticate within their handlers, because scheduled delivery and email previews must remain reachable without a browser session.
