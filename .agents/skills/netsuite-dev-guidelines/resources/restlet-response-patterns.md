# Restlet Response Patterns

Keep task handlers small. Validate the whole object, reject extra keys, check the authenticated identity and let the active role enforce record access. Use { success: true, data } or { success: false, error: { code, message, reference } }. A missing record is data: null; a permission/query failure is an error. Normalize id to string, map lowercase aliases and serialize only the fields the UI needs. Frontend code must check HTTP status and validate the envelope at runtime.
