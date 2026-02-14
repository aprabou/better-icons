import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";
import type { McpConfig } from "./types.js";


/**
 * Converts absolute file paths to shorter, more readable versions.
 * 
 * @param fullPath - Absolute file path to be shortened
 * @returns Shortened file path using ./ for cwd, 
 *                                    ~  for home,
 *                                    or unchanged.
 * 
 * @example
 * // If cwd is /Users/you/projects/app
 * shortenPath('/Users/you/projects/app/src/file.ts')
 * // Returns: './src/file.ts'
 * 
 * @example
 * shortenPath('/Users/you/.config/settings.json')
 * // Returns: '~/.config/settings.json'
 */
export function shortenPath(fullPath: string): string {
  const home = homedir();
  const cwd = process.cwd();
  if (fullPath.startsWith(cwd)) {
    return "." + fullPath.slice(cwd.length);
  }
  if (fullPath.startsWith(home)) {
    return fullPath.replace(home, "~");
  }
  return fullPath;
}


/**
 * Safely reads and parses a JSON file.
 * 
 * @param path - Absolute path to the JSON file 
 * @returns Object of parsed JSON file if it exists & is valid, otherwise empty object {}.
 * 
 * @example
 * const config = readJsonFile('~/.cursor/mcp.json')
 * // Returns: { mcpServers: { ... } } if exists
 * 
 * @example
 * const config = readJsonFile('/nonexistent.json')
 * // Returns: {}
 */
export function readJsonFile(path: string): McpConfig {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8"));
    }
  } catch {
    // File doesn't exist or is invalid JSON
  }
  return {};
}


/**
 * Writes JSON data to a file with automatic directory creation.
 * 
 * Creates parent directories recursively if they don't exist
 * Formats the JSON with 2-space indentation for readability
 * Overwrites existing files.
 * 
 * @param path - Absolute path to where the JSON file should be written 
 * @param data - JSON-serializable data to write
 * 
 * @example
 * const config = { mcpServers: { "better-icons": { command: "npx" } } }
 * writeJsonFile('~/.cursor/mcp.json', config)
 * // Creates ~/.cursor/ directory if needed and writes formatted JSON
 * 
 * @example
 * writeJsonFile('/new/deep/path/config.json', {})
 * // Creates all parent directories (/new/deep/path/) automatically
 */
export function writeJsonFile(path: string, data: McpConfig): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}
