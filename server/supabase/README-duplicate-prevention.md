# Duplicate / Multi-Account Prevention

This project can **block** (and optionally **auto-ban**) duplicate/multi-account registrations using a combination of:

- Case-insensitive unique email enforcement (database)
- Per-device limits (strong signal)
- Per-IP limits (weaker signal; can false-positive for shared networks)
- Similar-name heuristic (Levenshtein similarity on normalized names)

## 1) Apply the database migration

Run the SQL in [server/supabase/duplicate_prevention.sql](duplicate_prevention.sql) in Supabase SQL Editor.

This adds:
- A case-insensitive unique index on `lower(email)`
- Columns used by the server (`device_id`, `created_ip`, `name_normalized`, etc.)
- Indexes and a trigger to keep normalized fields up to date

## 2) Server configuration

Add these to `server/.env` as needed:

```env
# Turn off all duplicate checks (not recommended)
# DUPLICATE_PREVENTION=0

# Auto-ban new registrations that match duplicate rules
# AUTO_BAN_DUPLICATES=1

# Similarity threshold for normalized names (0..1)
# DUPLICATE_NAME_SIMILARITY=0.88

# Allow only N accounts per device (default: 1)
# MAX_ACCOUNTS_PER_DEVICE=1

# Allow only N accounts per IP per time window (default: 3 per 24h)
# MAX_ACCOUNTS_PER_IP=3
# IP_WINDOW_HOURS=24
```

## Notes / tradeoffs

- **Email uniqueness** is safe and should always be enabled.
- **Device-based blocking** is fairly reliable but can block families who share a phone.
- **IP-based blocking** can false-positive on shared mobile/Wi-Fi networks.
- Auto-banning based on IP is risky; this repo defaults to blocking on IP-only volume.
