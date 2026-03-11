# MSBC QBO Sales Order Tool

A browser-based tool for creating QuickBooks Online sales orders from internal restaurant location orders.

**Live URL:** https://mtnst8.github.io/msbc-tools/msbc_qbo_tool.html

---

## Normal Usage

1. Open the tool URL above
2. Click **Production** (should already be selected)
3. Credentials should auto-fill — if so, click **Authorize with QuickBooks**
4. Select **Mountain State Brewing Co.** (first one) and click **Next → Connect**
5. Review the pre-populated order lines, adjust if needed
6. Click **Push to QuickBooks**
7. Check QBO under **Sales → Estimates** for the created orders

---

## If Credentials Are Missing (New Browser / Cleared Cache)

The tool saves credentials in your browser's localStorage. If you're on a new device or browser, or localStorage was cleared, you'll need to re-enter them manually.

### Where to Find Each Field

**Client ID**
- Go to [developer.intuit.com](https://developer.intuit.com)
- Sign in → **My Apps** → **MSBC Sales Orders**
- Click **Keys & OAuth**
- Copy the **Production** Client ID (starts with `AB15d...`)

**Client Secret**
- Same page as Client ID
- Click **Show** next to the Production Client Secret
- Copy the full value

**Company ID (Realm ID)**
- Always: `109822452`
- This is the Mountain State Brewing Co. QBO company ID

**Redirect URI**
- Always: `https://mtnst8.github.io/msbc-tools/msbc_qbo_tool.html`
- This must also be registered in your Intuit app under Keys & OAuth → Redirect URIs

---

## Infrastructure

| Component | Details |
|---|---|
| GitHub Pages | https://mtnst8.github.io/msbc-tools/ |
| Cloudflare Worker | https://msbc-qbo-auth.brian-a40.workers.dev |
| Intuit App | MSBC Sales Orders (developer.intuit.com) |
| QBO Realm ID | 109822452 |
| QBO Environment | Production |

### Cloudflare Worker
The worker (`qbo-worker.js`) acts as a CORS proxy between the browser and:
- Intuit OAuth token exchange endpoint
- QuickBooks Online API (estimates, queries)

If the worker needs to be redeployed:
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → **msbc-qbo-auth**
3. Edit code → paste contents of `qbo-worker.js` → Deploy

---

## Product & Customer Mapping

| Display Name | QBO Product Name |
|---|---|
| 1/2 BBL Cold Trail | 2 Self Distribute:Cold Trail 1/2 BBL |
| 1/2 BBL Almost Heaven (Amber) | 2 Self Distribute:Amber 1/2 BBL |
| 1/2 BBL Seneca IPA | 2 Self Distribute:Seneca 1/2 BBL |
| 1/2 BBL Miner's Daughter | 2 Self Distribute:Miner's Daughter 1/2 BBL |
| 1/2 BBL Seasonal | 2 Self Distribute:Seasonal 1/2 BBL |
| Cans - Cold Trail | 2 Self Distribute:Cold Trail - Cans |
| Cans - Almost Heaven (Amber) | 2 Self Distribute:Amber - Cans |
| Cans - Seneca IPA | 2 Self Distribute:Seneca - Cans |
| Cans - Miner's Daughter | 2 Self Distribute:Miner's Daughter - Cans |
| Cans - Seasonal | 2 Self Distribute:Seasonal Cans |

| Location | QBO Customer |
|---|---|
| Star City | MSBC - Star City |
| Morgantown (Wharf) | MSBC - Morgantown |

---

## Sales Order Naming
Format: `Location-MM/DD/YYYY`
- Star City: `StarCity-03/11/2026`
- Morgantown: `Morgantown-03/11/2026`
