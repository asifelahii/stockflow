from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.db.database import get_db
from app.services.public_demo_service import bootstrap_public_demo_tenants


def main() -> int:
    db_generator = get_db()
    db = next(db_generator)

    try:
        tenants = bootstrap_public_demo_tenants(db)

        print("Public editable demo tenants are ready:")

        for tenant in tenants:
            print(
                f"  {tenant.tenant_key}: "
                f"{tenant.display_name} "
                f"(organization ID {tenant.organization_id})"
            )

        return 0
    except Exception:
        db.rollback()
        raise
    finally:
        db_generator.close()


if __name__ == "__main__":
    raise SystemExit(main())
