import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');
const localesRoot = path.join(srcRoot, 'locales', 'resources');

const getArgs = () => {
  const args = { n: [], langs: ['en', 'zh'] };
  process.argv.slice(2).forEach((arg, index, arr) => {
    if (arg.startsWith('-')) {
      const key = arg.substring(1);
      const next = arr[index + 1];
      if (next && !next.startsWith('-')) {
        args[key] = next.split(',');
      } else {
        args[key] = true;
      }
    }
  });
  return args;
};

const readJsonFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      return {};
    }
  }
  return {};
};

// Helper to get nested value from JSON object
const getNestedValue = (obj, pathStr) => {
  return pathStr.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const run = async () => {
  const { n: preservedNames, langs } = getArgs();
  const files = await glob('**/*.{ts,tsx}', { cwd: srcRoot, ignore: 'node_modules/**' });
  
  // 1. Load existing translations from JSON files
  const existingStore = {};
  langs.forEach(lang => {
    existingStore[lang] = readJsonFile(path.join(localesRoot, `${lang}.json`));
  });

  const allFoundKeys = new Map(); // Map<newKey, {originalKey, file, values}>
  const fileChanges = new Map();  // Map<file, Array<{originalKey, newKey, hasValue}>>

  // 2. Parse all files to find keys and annotations
  for (const file of files) {
    const filePath = path.join(srcRoot, file);
    const code = fs.readFileSync(filePath, 'utf-8');
    const changes = [];

    try {
      const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });

      traverse(ast, {
        CallExpression(p) {
          if (p.node.callee.name === 't') {
            const arg = p.node.arguments[0];
            if (arg && arg.type === 'StringLiteral') {
              const rawKey = arg.value;
              
              // Extract annotations: -en:Value-zh:Value
              const valuesFromAnnotation = {};
              const regex = new RegExp(`-(${langs.join('|')})\\:(.*?)(?=-|$)`, 'g');
              let strippedKey = rawKey;
              let match;
              while ((match = regex.exec(rawKey)) !== null) {
                valuesFromAnnotation[match[1]] = match[2];
                strippedKey = strippedKey.replace(match[0], '');
              }

              // Determine final key name
              let finalKey = strippedKey;
              const isPreserved = preservedNames.some(p => strippedKey.startsWith(p));
              if (!isPreserved) {
                const parts = path.parse(file);
                const dirParts = parts.dir.split(path.sep).filter(Boolean);
                const keyParts = strippedKey.split('.');
                finalKey = [...dirParts, parts.name, keyParts[keyParts.length - 1]].join('.');
              }

              // Merge logic: Annotation > Existing JSON
              const mergedValues = {};
              let hasAnyValue = false;

              langs.forEach(lang => {
                const val = valuesFromAnnotation[lang] || getNestedValue(existingStore[lang], finalKey);
                if (val && val !== '?') {
                  mergedValues[lang] = val;
                  hasAnyValue = true;
                }
              });

              allFoundKeys.set(finalKey, { values: mergedValues });
              changes.push({ originalKey: rawKey, newKey: finalKey, hasValue: hasAnyValue });
            }
          }
        },
      });

      if (changes.length > 0) fileChanges.set(file, changes);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e.message);
    }
  }

  // 3. Update Source Files (Apply '?' if no value found)
  for (const [file, changes] of fileChanges.entries()) {
    const filePath = path.join(srcRoot, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const { originalKey, newKey, hasValue } of changes) {
      const escapedKey = originalKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match t('key') or t('key', 'default')
      const regex = new RegExp(`t\\((['"\`])${escapedKey}\\1(,\\s*['"\`].*?['"\`])?\\)`, 'g');
      
      const replacement = hasValue ? `t('${newKey}')` : `t('${newKey}', '?')`;
      content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Cleaned source: ${file}`);
  }

  // 4. Write merged results to JSON
  langs.forEach(lang => {
    const result = {};
    for (const [fullKey, data] of allFoundKeys.entries()) {
      const parts = fullKey.split('.');
      let current = result;
      parts.forEach((part, i) => {
        if (i === parts.length - 1) {
          current[part] = data.values[lang] || ""; // No '?' in JSON
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    }

    const langPath = path.join(localesRoot, `${lang}.json`);
    fs.mkdirSync(path.dirname(langPath), { recursive: true });
    fs.writeFileSync(langPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Updated resources: ${lang}.json`);
  });
};

run().catch(console.error);
