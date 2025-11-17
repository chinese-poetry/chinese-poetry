import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---

// These are the directories at the root of the project containing poetry JSON files.
const POETRY_SOURCE_DIRS = [
  '五代诗词',
  '元曲',
  '全唐诗',
  '四书五经',
  '宋词',
  '幽梦影',
  '御定全唐詩',
  '曹操诗集',
  '楚辞',
  '水墨唐诗',
  '纳兰性德',
  '蒙学',
  '论语',
  '诗经'
];

// --- Path Setup (Platform-Independent) ---

// Get the directory of the current script to robustly locate the project root.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The project root is two levels up from the /typing-practice/scripts directory.
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// The target file where the consolidated data will be saved.
const TARGET_FILE = path.join(PROJECT_ROOT, 'typing-practice', 'public', 'poetry.json');

/**
 * Reads all .json files from the poetry source directories, extracts the paragraphs,
 * and consolidates them into a single array.
 */
async function consolidatePoetry() {
  const allParagraphs = [];
  console.log('Starting poetry consolidation...');
  console.log(`Project root identified as: ${PROJECT_ROOT}`);

  for (const dirName of POETRY_SOURCE_DIRS) {
    const sourcePath = path.join(PROJECT_ROOT, dirName);
    try {
      // Check if the directory exists before trying to read it.
      await fs.access(sourcePath);
      const files = await fs.readdir(sourcePath);
      console.log(`Reading directory: ${sourcePath}`);

      for (const file of files) {
        if (path.extname(file).toLowerCase() === '.json') {
          const filePath = path.join(sourcePath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const poems = JSON.parse(content);

          if (Array.isArray(poems)) {
            for (const poem of poems) {
              if (poem.paragraphs && Array.isArray(poem.paragraphs)) {
                // Clean and join paragraphs into a single string.
                const cleanedText = poem.paragraphs
                  .map(p => p.trim().replace(/\s+/g, '')) // Remove whitespace and newlines
                  .filter(p => p.length > 0)
                  .join('。'); // Use a standard separator
                if (cleanedText) {
                  allParagraphs.push(cleanedText);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // Log a warning if a directory is missing or can't be read, then continue.
      if (error.code === 'ENOENT') {
        console.warn(`Warning: Directory not found, skipping: ${sourcePath}`);
      } else {
        console.warn(`Warning: Could not process directory ${sourcePath}: ${error.message}`);
      }
    }
  }

  try {
    // Ensure the target directory exists.
    await fs.mkdir(path.dirname(TARGET_FILE), { recursive: true });
    // Write the final consolidated data.
    await fs.writeFile(TARGET_FILE, JSON.stringify(allParagraphs, null, 2), 'utf-8');
    console.log(`✅ Successfully consolidated ${allParagraphs.length} entries into ${TARGET_FILE}`);
  } catch (error) {
    console.error(`❌ Error: Failed to write consolidated file: ${error.message}`);
    process.exit(1); // Exit with an error code
  }
}

// Run the consolidation process.
consolidatePoetry();
