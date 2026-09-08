const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { XMLParser } = require('fast-xml-parser');
const config = require('../../../template.config.json');

test('fresh generation supplies a dedicated viewer for the required record permission list', () => {
  const destination = mkdtempSync(path.join(tmpdir(), 'nvs permissions '));
  try {
    execFileSync(process.execPath, [path.resolve('../../scripts/generate.mjs'), '--output', destination]);
    const parse = name => new XMLParser({ ignoreAttributes: false }).parse(
      readFileSync(path.join(destination, 'Objects', name + '.xml'), 'utf8'));
    const recordId = 'customrecord_' + config.prefix + '_hello';
    const roleId = 'customrole_' + config.prefix + '_hello_viewer';
    const record = parse(recordId).customrecordtype;
    expect(record.accesstype).toBe('USEPERMISSIONLIST');
    expect(record.permissions?.permission).toEqual({
      permittedrole: '[scriptid=' + roleId + ']', permittedlevel: 'VIEW', restriction: 'EDIT',
    });
    const role = parse(roleId).role;
    expect(role['@_scriptid']).toBe(roleId);
    expect(role.coreadminpermission).toBe('F');
    expect(role.permissions.permission).toEqual({
      permkey: '[scriptid=' + recordId + ']', permlevel: 'VIEW', restriction: 'EDIT',
    });
  } finally {
    rmSync(destination, { recursive: true, force: true });
  }
});
