import fs from "node:fs";
import path from "node:path";
import { ShopStore } from "./store.js";
import { backupStore, restoreStore } from "./maintenance.js";

const [command, id, output] = process.argv.slice(2);
const filename = process.env.SHOP_DB_PATH || "/data/shop/shop.sqlite";
let store;
try {
  if (command === "restore") {
    if (!id || !output || !process.env.SHOP_LIFECYCLE_LEDGER)
      throw new Error("USAGE_restore_BACKUP_NEW_DB_WITH_SHOP_LIFECYCLE_LEDGER");
    restoreStore(
      output,
      id,
      process.env.SHOP_LIFECYCLE_LEDGER,
      process.env.SHOP_BACKUP_KEY,
    );
    console.log(
      "Restored into a new database; review notifications before switching the stopped service.",
    );
  } else {
    if (!fs.existsSync(filename)) throw new Error("DATABASE_NOT_FOUND");
    store = new ShopStore(filename);
    if (command === "stats") console.log(JSON.stringify(store.stats()));
    else if (command === "list")
      console.log(
        JSON.stringify(
          store.db
            .prepare(
              "SELECT id,status,created_at,closed_at FROM requests ORDER BY created_at DESC LIMIT 100",
            )
            .all(),
        ),
      );
    else if (command === "close") store.mark(id, "closed");
    else if (command === "converted") store.mark(id, "converted");
    else if (command === "erase") {
      if (!store.erase(id)) throw new Error("REQUEST_NOT_FOUND");
    } else if (command === "purge")
      console.log(JSON.stringify({ purged: store.purge() }));
    else if (command === "compact-ledger") {
      if (process.env.SHOP_SERVICE_STOPPED !== "true")
        throw new Error("STOP_API_AND_SET_SHOP_SERVICE_STOPPED");
      store.purge();
      console.log(JSON.stringify({ records: store.compactLedger() }));
    } else if (command === "retry-mail") {
      const result = store.db
        .prepare(
          "UPDATE outbox SET state='pending',attempts=0,next_at=?,lease_until=NULL,last_error=NULL WHERE request_id=? AND state='failed'",
        )
        .run(Date.now(), id);
      console.log(JSON.stringify({ queued: result.changes }));
    } else if (command === "export") {
      if (!output) throw new Error("EXPORT_REQUIRES_PRIVATE_OUTPUT_FILE");
      fs.writeFileSync(
        output,
        JSON.stringify(store.exportRequest(id), null, 2),
        { mode: 0o600, flag: "wx" },
      );
      console.log(
        "Export written to the requested private file; it contains personal data.",
      );
    } else if (command === "backup") {
      console.log(
        backupStore(
          store,
          id || path.join(path.dirname(filename), "backups"),
          process.env.SHOP_BACKUP_KEY,
        ),
      );
    } else
      throw new Error(
        "Commands: stats, list, close ID, converted ID, erase ID, purge, compact-ledger, retry-mail ID, export ID FILE, backup [DIR], restore BACKUP NEW_DB",
      );
  }
} catch (error) {
  console.error(
    error.code ||
      (/^[A-Z_]+$/.test(error.message)
        ? error.message
        : "ADMIN_COMMAND_FAILED; see docs/shop-operations.md"),
  );
  process.exitCode = 1;
} finally {
  store?.close();
}
