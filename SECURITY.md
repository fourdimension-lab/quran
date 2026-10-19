# Security & Privacy Policy — Al-Quran Platform

## 1. Sacred Content Immutability
- The canonical Arabic text of the Quran is stored as read-only constants and protected by database Row Level Security policies.
- Public read access is open to all users (`FOR SELECT USING (true)`), while all modifications (`INSERT`, `UPDATE`, `DELETE`) require service-role credentials and explicit administrative review.

## 2. User Data Isolation & Row Level Security (RLS)
- User notes, bookmarks, reading progress, and vocabulary lists are private by default.
- Every user table is guarded by Supabase RLS:
  ```sql
  CREATE POLICY "Users can manage own notes" ON public.user_notes
  FOR ALL USING (auth.uid() = user_id);
  ```
- No user can view, query, or mutate another user's personal reflections or study history.

## 3. AI Safety & Grounding Guardrails
- **Anti-Hallucination Gate**: All AI query responses are parsed for verse citations and validated against the internal canonical Surah list before rendering.
- **Fatwa Disclaimer**: The platform enforces a mandatory disclaimer on all AI-synthesized responses:
  > *"Scholarly Notice: This is an educational synthesis grounded in authentic sources and does not constitute a formal legal ruling (Fatwa). Consult qualified Islamic scholars for personal legal determinations."*
- **Server-Side Credentials**: LLM API keys (`AI_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) are kept strictly on the server and are never exposed to browser bundles.

## 4. Privacy & Data Ownership
- Users can export their entire study profile (bookmarks, notes, vocabulary, reading history) as JSON at any time from `/study`.
- Users can clear their local study data with immediate effect.
