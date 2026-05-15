import http from 'http';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const url = new URL('/api/health', BASE_URL);

interface HeaderCheck {
  header: string;
  expected: string | RegExp | null;
  description: string;
  severity: 'FAIL' | 'WARN';
}

const securityHeaders: HeaderCheck[] = [
  {
    header: 'x-content-type-options',
    expected: 'nosniff',
    description: 'Prevents MIME-type sniffing',
    severity: 'FAIL',
  },
  {
    header: 'x-frame-options',
    expected: /DENY|SAMEORIGIN/i,
    description: 'Prevents clickjacking attacks',
    severity: 'FAIL',
  },
  {
    header: 'content-security-policy',
    expected: null,
    description: 'Controls resources the browser is allowed to load',
    severity: 'WARN',
  },
  {
    header: 'strict-transport-security',
    expected: null,
    description: 'Enforces HTTPS connections',
    severity: 'WARN',
  },
  {
    header: 'x-xss-protection',
    expected: null,
    description: 'Legacy XSS protection (modern browsers use CSP)',
    severity: 'WARN',
  },
  {
    header: 'x-powered-by',
    expected: undefined as unknown as null,
    description: 'Should NOT be present (information disclosure)',
    severity: 'FAIL',
  },
];

function checkHeader(
  headers: http.IncomingHttpHeaders,
  check: HeaderCheck,
): { pass: boolean; actual: string } {
  const actual = headers[check.header] as string | undefined;

  if (check.header === 'x-powered-by') {
    return { pass: actual === undefined, actual: actual || '(not set)' };
  }

  if (check.expected === null) {
    return { pass: actual !== undefined, actual: actual || '(not set)' };
  }

  if (check.expected instanceof RegExp) {
    return { pass: check.expected.test(actual || ''), actual: actual || '(not set)' };
  }

  return { pass: actual === check.expected, actual: actual || '(not set)' };
}

console.log('==============================================');
console.log('  OWASP Security Headers Check');
console.log(`  Target: ${url.toString()}`);
console.log('==============================================\n');

http.get(url.toString(), (res) => {
  let failures = 0;
  let warnings = 0;
  let passes = 0;

  for (const headerCheck of securityHeaders) {
    const result = checkHeader(res.headers, headerCheck);
    const icon = result.pass ? 'PASS' : headerCheck.severity;

    if (!result.pass && headerCheck.severity === 'FAIL') failures++;
    else if (!result.pass && headerCheck.severity === 'WARN') warnings++;
    else passes++;

    console.log(`  [${icon}] ${headerCheck.header}`);
    console.log(`         ${headerCheck.description}`);
    console.log(`         Value: ${result.actual}`);
    console.log('');
  }

  console.log('==============================================');
  console.log(`  Results: ${passes} passed, ${warnings} warnings, ${failures} failures`);
  console.log('==============================================');

  if (failures > 0) {
    console.log('\nFAILED: Security header checks did not pass.');
    process.exit(1);
  }

  console.log('\nPASSED: All critical security headers present.');
  process.exit(0);
});
