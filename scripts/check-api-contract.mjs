import fs from 'node:fs';
import path from 'node:path';
import contract from '../src/contracts/marketplace-contract.json' with { type: 'json' };

const root = path.resolve('src');
const allowed = new Set([...contract.public_endpoints, ...contract.admin_endpoints]);
const files = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const target = path.join(dir, entry.name);
  if (entry.isDirectory()) walk(target);
  else if (/\.(js|jsx)$/.test(entry.name)) files.push(target);
});
walk(root);

const normalizePath = (value) => value
  .replace(/\$\{[^}]+\}/g, '{param}')
  .replace(/\/\d+(?=\/|$)/g, '/{param}');
const normalizeDeclared = (value) => value.replace(/\{[^}]+\}/g, '{param}');
const compatible = (method, pathValue) => {
  const candidate = `${method.toUpperCase()} ${normalizePath(pathValue)}`;
  return [...allowed].some((declared) => normalizeDeclared(declared) === candidate);
};

const errors = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/api\.(get|post|put|delete|patch)\(\s*([`'"])(\/[^`'"]+)\2/g)) {
    const [, method, , endpoint] = match;
    if (endpoint.includes('${resource}') || endpoint.includes('${r}') || endpoint.startsWith('/${')) continue;
    if (!compatible(method, endpoint)) errors.push(`${path.relative(root, file)}: ${method.toUpperCase()} ${endpoint}`);
  }
}

const genericResources = new Set();
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/create(?:Crud|Paginated)Service\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    genericResources.add(match[1]);
  }
}
for (const resource of genericResources) {
  const hasList = [...allowed].some((entry) => normalizeDeclared(entry) === `GET /${resource}`);
  if (!hasList) errors.push(`Generic service resource is not declared: GET /${resource}`);
}

if (errors.length) {
  console.error(`Admin API contract drift:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Admin API contract OK (${contract.contract_version}).`);
