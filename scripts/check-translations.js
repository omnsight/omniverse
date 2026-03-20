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
const localesRoot = path.join(srcRoot, 'locales', 'resources');

const enPath = path.join(localesRoot, 'en.json');
const zhPath = path.join(localesRoot, 'zh.json');

const getTranslationKeys = async () => {
  const files = await glob('**/*.{ts,tsx}', { cwd: srcRoot });
  const keys = new Set();

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
              keys.add(arg.value);
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

const readJsonFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  return {};
};

const toNestedObject = (keys, existingTranslations) => {
  const result = {};

  keys.forEach((key) => {
    const keyParts = key.split('.');
    let current = result;
    let existing = existingTranslations;

    keyParts.forEach((part, index) => {
      if (index === keyParts.length - 1) {
        if (current[part] === undefined) {
          // Use undefined check to allow empty strings
          current[part] = existing && existing[part] !== undefined ? existing[part] : '';
        }
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
        if (existing) {
          existing = existing[part];
        }
      }
    });
  });

  return result;
};

const run = async () => {
  const usedKeys = await getTranslationKeys();

  const enTranslations = readJsonFile(enPath);
  const zhTranslations = readJsonFile(zhPath);

  const newEnTranslations = toNestedObject(usedKeys, enTranslations);
  const newZhTranslations = toNestedObject(usedKeys, zhTranslations);

  fs.writeFileSync(enPath, JSON.stringify(newEnTranslations, null, 2));
  fs.writeFileSync(zhPath, JSON.stringify(newZhTranslations, null, 2));

  console.log('Updated translation files:');
  console.log(enPath);
  console.log(zhPath);
};

run();
