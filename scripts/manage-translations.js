import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');

const getArgs = () => {
  const args = {};
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

const getTranslationKeys = async () => {
  const files = await glob('**/*.{ts,tsx}', { cwd: srcRoot });
  const keys = [];

  for (const file of files) {
    const filePath = path.join(srcRoot, file);
    const code = fs.readFileSync(filePath, 'utf-8');

    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      traverse(ast, {
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 't') {
            const arg = path.node.arguments[0];
            if (arg && arg.type === 'StringLiteral') {
              keys.push({ key: arg.value, file });
            }
          }
        },
      });
    } catch (error) {
      console.error(`Error parsing file: ${filePath}`);
      console.error(error);
    }
  }

  return keys;
};

const processKeys = (keys, preservedNames, langs) => {
  const processedKeys = new Map();

  for (const { key, file } of keys) {
    let newKey = key;
    const values = {};

    const preserve = preservedNames.some((name) => key.startsWith(name));

    // Parse values
    const regex = new RegExp(`-(${langs.join('|')})\\:(.*?)(?=-|$)`, 'g');
    let match;
    let strippedKey = key;
    while ((match = regex.exec(key)) !== null) {
      values[match[1]] = match[2];
      strippedKey = strippedKey.replace(match[0], '');
    }

    if (!preserve) {
      const parts = path.parse(file);
      const dirParts = parts.dir.split(path.sep);
      const fileName = parts.name;
      const keyParts = strippedKey.split('.');
      const lastPart = keyParts[keyParts.length - 1];

      newKey = [...dirParts, fileName, lastPart].join('.');
    } else {
      newKey = strippedKey;
    }

    processedKeys.set(newKey, { values, originalKey: key, file });
  }

  return processedKeys;
};

const localesRoot = path.join(srcRoot, 'locales', 'resources');

const readJsonFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  return {};
};

const toNestedObject = (keys, existingTranslations, lang) => {
  const result = {};

  keys.forEach((data, key) => {
    const keyParts = key.split('.');
    let current = result;
    let existing = existingTranslations;

    keyParts.forEach((part, index) => {
      if (existing) {
        existing = existing[part];
      }
      if (index === keyParts.length - 1) {
        current[part] = data.values[lang] || (existing && existing) || '?';
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return result;
};

const updateSourceFiles = async (processedKeys) => {
  const changesByFile = new Map();

  // Group changes by file
  for (const [newKey, { originalKey, file }] of processedKeys.entries()) {
    if (newKey !== originalKey) {
      if (!changesByFile.has(file)) {
        changesByFile.set(file, []);
      }
      changesByFile.get(file).push({ originalKey, newKey });
    }
  }

  // Apply changes to each file
  for (const [file, changes] of changesByFile.entries()) {
    const filePath = path.join(srcRoot, file);
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      for (const { originalKey, newKey } of changes) {
        const escapedOriginalKey = originalKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(`t\\((['\"\`])(${escapedOriginalKey})\\1\\)`, 'g');
        content = content.replace(searchRegex, `t('${newKey}')`);
      }
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated translation keys in: ${file}`);
    } catch (error) {
      console.error(`Error updating file: ${filePath}`, error);
    }
  }
};

const run = async () => {
  const args = getArgs();
  const preservedNames = args.n || [];
  const langs = args.langs || ['en', 'zh'];

  console.log('Running with preserved names:', preservedNames);
  console.log('Running with languages:', langs);

  const usedKeys = await getTranslationKeys();
  const processedKeys = processKeys(usedKeys, preservedNames, langs);

  await updateSourceFiles(processedKeys);

  for (const lang of langs) {
    const langPath = path.join(localesRoot, `${lang}.json`);
    const existingTranslations = readJsonFile(langPath);
    const newTranslations = toNestedObject(processedKeys, existingTranslations, lang);
    fs.writeFileSync(langPath, JSON.stringify(newTranslations, null, 2));
    console.log(`Updated translation file: ${langPath}`);
  }
};

run();
