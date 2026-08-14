# 🇮🇳 Tiranga Connect — Project Flow

## Application Flow

```
Landing Page → Register (with optional referral code) → Dashboard → Share Referral Link → Network Grows
```

## Referral Flow (Core Feature)

### Step 1: User A Registers
- User A visits the site and registers
- System generates unique referral code (e.g., SONU91)
- User A gets their referral link: `/register?ref=SONU91`

### Step 2: User A Shares Link
- User A shares referral link via WhatsApp, Telegram, Email, or Copy
- Link contains the referral code as URL parameter

### Step 3: User B Opens Link
- User B clicks the referral link
- Register page auto-fills the referral code
- Shows: "🇮🇳 You were invited by SONU"

### Step 4: User B Registers
- User B fills registration form
- Backend validates referral code
- Creates User B with `referredBy: SONU91`
- Increments User A's `referralCount`
- Calculates User B's level (User A's level + 1)
- Generates User B's own referral code
- Creates notification for User A
- Checks and unlocks achievements for User A

### Step 5: Network Grows
- User B gets their own referral link
- User B shares with User C
- Process repeats recursively

## Database Relationships

```
User A (SONU)
  referralCode: SONU91
  referredBy: ""       (root user)
  referralCount: 2
  level: 1

User B (RAHUL)
  referralCode: RAHUL82
  referredBy: SONU91   (refers back to User A)
  referralCount: 1
  level: 2

User C (AMAN)
  referralCode: AMAN33
  referredBy: RAHUL82  (refers back to User B)
  referralCount: 0
  level: 3
```

## Tree Building Algorithm

1. Start with root user's referral code
2. Query all users where `referredBy === rootCode`
3. For each found user, recursively query their referrals
4. Build tree data structure
5. Convert to React Flow nodes and edges

## Achievement System

| Achievement | Threshold | Icon |
|------------|-----------|------|
| First Connection | 1 referral | 🇮🇳 |
| Unity Builder | 5 referrals | 🟠 |
| Nation Connector | 10 referrals | ⚪ |
| India Networker | 25 referrals | 🟢 |
| Ashoka Champion | 50 referrals | 🔵 |
| Unity Legend | 100 referrals | 🇮🇳 |

Achievements are checked after every new referral registration.

## Architecture

```
Frontend (Next.js :3000)
    │
    ├── API calls via Axios
    │
    ▼
Backend (Express :5000)
    │
    ├── JWT Auth
    ├── Controllers → Services
    │
    ▼
MongoDB
    │
    ├── Users Collection
    ├── Achievements Collection
    └── Notifications Collection
```
