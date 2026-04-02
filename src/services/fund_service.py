"""
Portföy servisi: TEFAS fon verileri, hisse ve kripto fiyatları.
"""
import sys
from tefas import Crawler

tefas = Crawler()

"""
if len(sys.argv) < 2:
    print("Usage: python3 fund_service.py <command> [args]")
    print("  commands: fetch <fund_code> [start_date] [end_date]")
    sys.exit(1)
"""
cmd = sys.argv[1] if len(sys.argv) > 1 else "list"

if cmd == "fetch":
    code = sys.argv[2]
    start = sys.argv[3] if len(sys.argv) > 3 else None
    end = sys.argv[4] if len(sys.argv) > 4 else None

    kwargs = {"start": start, "name": code}
    if end:
        kwargs["end"] = end

    data = tefas.fetch(**kwargs)
    for _, row in data.iterrows():
        print(dict(row))

elif cmd == "list":
    data = tefas.fetch(start="2026-04-01")
    for _, row in data.iterrows():
        print(f"{row.get('code', '?')} - {row.get('title', '?')} - {row.get('price', '?')}")

else:
    print(f"Unknown command: {cmd}")
    sys.exit(1)
