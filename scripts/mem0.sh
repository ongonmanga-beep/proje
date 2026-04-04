#!/usr/bin/env bash
cd /Users/hayli/.openclaw && source .venv/bin/activate
python3 - "$@" << 'PYEOF'
import sys, json
from mem0 import MemoryClient

client = MemoryClient(api_key="m0-2TOqmBcfobG5FpM7qKH7fPjVCQj8kSC8PFTzWXKy")
action = sys.argv[1]

if action == "add":
    text = sys.argv[2]
    res = client.add([{"role": "user", "content": text}], user_id="salih")
    print(json.dumps(res, ensure_ascii=False))
elif action == "search":
    q = sys.argv[2]
    res = client.search(q, filters={"user_id": "salih"})
    print(json.dumps(res, ensure_ascii=False))
elif action == "get_all":
    res = client.get_all(filters={"user_id": "salih"})
    print(json.dumps(res, ensure_ascii=False))
PYEOF
