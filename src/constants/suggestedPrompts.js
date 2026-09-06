/** Search-oriented prompts the assistant can suggest (pick a random subset in the UI). */
export const SUGGESTED_PROMPT_POOL = [
  "Who works in Engineering?",
  "Show me employee statistics",
  "Which departments do we have?",
  "Find a Product Manager",
  "List everyone in Marketing",
  "Who is currently on leave?",
  "How many active employees are there?",
  "Find people with Designer in their title",
  "Which department has the most people?",
  "Search for someone named Alex",
  "Show me recent hires",
  "Who works in Sales?",
  "List inactive employees",
  "Find all Managers",
  "Break down headcount by department",
  "Who is in Human Resources?",
  "Find a Software Engineer",
  "Compare Engineering vs Product headcount",
  "Show people in Finance",
  "Search for remote-friendly roles",
];

/**
 * Return `count` unique prompts chosen at random from the pool.
 */
export function pickRandomPrompts(count = 4) {
  const pool = [...SUGGESTED_PROMPT_POOL];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
