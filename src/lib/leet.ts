const MAP: Record<string, string> = {
  a: '4', A: '4',
  e: '3', E: '3',
  i: '1', I: '1',
  o: '0', O: '0',
  t: '7', T: '7',
  s: '5', S: '5',
}

export function leetify(text: string): string {
  return text.split('').map((c) => MAP[c] ?? c).join('')
}
