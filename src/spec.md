# Specification

## Summary
**Goal:** Fix the Internet Identity login flow and verify end-to-end functionality for notes and break reminders.

**Planned changes:**
- Debug and fix the Internet Identity authentication in the extension content script
- Ensure login state persists and the authenticated principal is available to actor hooks
- Verify notes CRUD operations (create, read, edit, delete) work after login
- Verify break reminder settings and notifications work after login

**User-visible outcome:** Users can successfully log in with Internet Identity and use all features (notes and break reminders) without errors.
