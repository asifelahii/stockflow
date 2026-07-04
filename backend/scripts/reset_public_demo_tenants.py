from __future__ import annotations

import argparse
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.db.database import get_db
from app.services.public_demo_service import reset_due_public_demo_tenants


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Reset due public StockFlow demo tenants."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Reset both public demo tenants immediately.",
    )
    args = parser.parse_args()

    db_generator = get_db()
    db = next(db_generator)

    try:
        reset_tenants = reset_due_public_demo_tenants(
            db,
            force=args.force,
        )

        if reset_tenants:
            print("Reset public demo tenants:")
            for tenant_key in reset_tenants:
                print(f"  {tenant_key}")
        else:
            print("No public demo tenant reset is due.")

        return 0
    except Exception:
        db.rollback()
        raise
    finally:
        db_generator.close()


if __name__ == "__main__":
    raise SystemExit(main())
