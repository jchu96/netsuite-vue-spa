/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/query', 'N/runtime', 'N/log'], (query, runtime, log) => {
  function post(body) {
    const reference = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    if (Number(runtime.getCurrentUser().id) <= 0) {
      return { success: false, error: { code: 'ACCESS_DENIED', message: 'Access denied', reference } };
    }
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).sort().join(',') !== 'name,task' || body.task !== 'helloRecord' ||
        typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.length > 80) {
      return { success: false, error: { code: 'INVALID_REQUEST', message: 'Use helloRecord with a name of 1–80 characters', reference } };
    }
    try {
      // The only identifiers come from validated generator configuration. All values are bound.
      const rows = query.runSuiteQL({
        query: 'SELECT TOP 1 id, name FROM customrecord_nvs_hello WHERE name = ? AND isinactive = ? ORDER BY id',
        params: [body.name, 'F'],
        metaDataProvider: 'SUITE_QL'
      }).asMappedResults();
      return { success: true, data: rows.length ? { id: String(rows[0].id), name: String(rows[0].name) } : null };
    } catch {
      log.error({ title: 'helloRecord failed', details: { reference, code: 'INTERNAL_ERROR' } });
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to read hello record', reference } };
    }
  }
  return { post };
});
