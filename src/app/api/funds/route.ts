import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { exec } = await import("child_process");
    const util = await import("util");
    const execAsync = util.promisify(exec);

    const { stdout } = await execAsync(
      `cd /Users/hayli/.openclaw && source .venv/bin/activate && python3 -c "
from tefas import Crawler
tefas = Crawler()
data = tefas.fetch(start='2026-04-03')
print(data[['code','title','price']].to_json(orient='records'))
" 2>/dev/null`
    );
    return NextResponse.json(JSON.parse(stdout));
  } catch {
    return NextResponse.json([]);
  }
}
