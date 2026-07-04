from __future__ import annotations

from datetime import date, datetime, time, timedelta
from decimal import Decimal
from secrets import token_urlsafe
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.category import ExpenseCategory, ProductCategory
from app.models.financial_transaction import FinancialTransaction
from app.models.organization import Organization, OrganizationMember
from app.models.product import Product
from app.models.public_demo_tenant import PublicDemoTenant
from app.models.stock_movement import StockMovement
from app.models.supplier import Supplier
from app.models.user import User


PUBLIC_DEMO_PROFILES: tuple[dict[str, Any], ...] = (
    {
        "tenant_key": "tenant_1",
        "display_name": "Northstar Electronics",
        "industry": "Consumer electronics",
        "organization_name": "Public Demo - Northstar Electronics",
        "user_email": "northstar.demo@stockflow-demo.com",
        "user_name": "Northstar Demo Administrator",
        "suppliers": (
            "Vertex Imports",
            "Circuit Wholesale",
        ),
        "product_categories": (
            "Accessories",
            "Audio",
            "Computing",
        ),
        "expense_categories": (
            "Procurement",
            "Logistics",
            "Utilities",
            "Marketing",
        ),
        "income_base": 68500,
        "income_growth": 2300,
        "products": (
            {
                "name": "Wireless Mouse Pro",
                "sku": "NST-MSE-001",
                "category": "Accessories",
                "supplier": "Vertex Imports",
                "purchase_price": "720.00",
                "selling_price": "1190.00",
                "threshold": 12,
                "base_in": 28,
                "base_out": 20,
                "in_step": 2,
                "out_step": 1,
                "offset": 0,
                "target_stock": 84,
            },
            {
                "name": "USB-C Hub 8-in-1",
                "sku": "NST-HUB-001",
                "category": "Accessories",
                "supplier": "Vertex Imports",
                "purchase_price": "1380.00",
                "selling_price": "2150.00",
                "threshold": 8,
                "base_in": 15,
                "base_out": 11,
                "in_step": 1,
                "out_step": 1,
                "offset": 1,
                "target_stock": 34,
            },
            {
                "name": "Mechanical Keyboard",
                "sku": "NST-KEY-001",
                "category": "Computing",
                "supplier": "Circuit Wholesale",
                "purchase_price": "2550.00",
                "selling_price": "3800.00",
                "threshold": 7,
                "base_in": 14,
                "base_out": 10,
                "in_step": 1,
                "out_step": 1,
                "offset": 2,
                "target_stock": 26,
            },
            {
                "name": "Noise Canceling Headset",
                "sku": "NST-HDS-001",
                "category": "Audio",
                "supplier": "Circuit Wholesale",
                "purchase_price": "3150.00",
                "selling_price": "4700.00",
                "threshold": 6,
                "base_in": 10,
                "base_out": 8,
                "in_step": 1,
                "out_step": 1,
                "offset": 3,
                "target_stock": 5,
            },
            {
                "name": "4K Webcam",
                "sku": "NST-WEB-001",
                "category": "Computing",
                "supplier": "Circuit Wholesale",
                "purchase_price": "2350.00",
                "selling_price": "3450.00",
                "threshold": 5,
                "base_in": 9,
                "base_out": 9,
                "in_step": 1,
                "out_step": 1,
                "offset": 1,
                "target_stock": 0,
            },
        ),
    },
    {
        "tenant_key": "tenant_2",
        "display_name": "Greenleaf Office Supplies",
        "industry": "Office and stationery",
        "organization_name": "Public Demo - Greenleaf Office Supplies",
        "user_email": "greenleaf.demo@stockflow-demo.com",
        "user_name": "Greenleaf Demo Administrator",
        "suppliers": (
            "PaperCraft Distributors",
            "OfficePlus Trading",
        ),
        "product_categories": (
            "Paper Products",
            "Writing",
            "Desk Essentials",
        ),
        "expense_categories": (
            "Purchasing",
            "Delivery",
            "Utilities",
            "Promotion",
        ),
        "income_base": 47200,
        "income_growth": 1650,
        "products": (
            {
                "name": "A4 Premium Paper Ream",
                "sku": "GLF-PPR-001",
                "category": "Paper Products",
                "supplier": "PaperCraft Distributors",
                "purchase_price": "410.00",
                "selling_price": "590.00",
                "threshold": 30,
                "base_in": 70,
                "base_out": 54,
                "in_step": 3,
                "out_step": 2,
                "offset": 0,
                "target_stock": 180,
            },
            {
                "name": "Gel Pen Box",
                "sku": "GLF-PEN-001",
                "category": "Writing",
                "supplier": "OfficePlus Trading",
                "purchase_price": "360.00",
                "selling_price": "560.00",
                "threshold": 18,
                "base_in": 35,
                "base_out": 27,
                "in_step": 2,
                "out_step": 1,
                "offset": 1,
                "target_stock": 75,
            },
            {
                "name": "Desktop File Organizer",
                "sku": "GLF-ORG-001",
                "category": "Desk Essentials",
                "supplier": "OfficePlus Trading",
                "purchase_price": "690.00",
                "selling_price": "980.00",
                "threshold": 10,
                "base_in": 19,
                "base_out": 14,
                "in_step": 1,
                "out_step": 1,
                "offset": 2,
                "target_stock": 21,
            },
            {
                "name": "Stapler Set",
                "sku": "GLF-STP-001",
                "category": "Desk Essentials",
                "supplier": "OfficePlus Trading",
                "purchase_price": "290.00",
                "selling_price": "470.00",
                "threshold": 12,
                "base_in": 24,
                "base_out": 19,
                "in_step": 1,
                "out_step": 1,
                "offset": 3,
                "target_stock": 9,
            },
            {
                "name": "Sticky Notes Pack",
                "sku": "GLF-STK-001",
                "category": "Writing",
                "supplier": "PaperCraft Distributors",
                "purchase_price": "160.00",
                "selling_price": "280.00",
                "threshold": 14,
                "base_in": 28,
                "base_out": 28,
                "in_step": 1,
                "out_step": 1,
                "offset": 1,
                "target_stock": 0,
            },
        ),
    },
)

PROFILE_BY_KEY = {
    profile["tenant_key"]: profile
    for profile in PUBLIC_DEMO_PROFILES
}


def _reset_interval_hours() -> int:
    return max(1, min(int(settings.demo_reset_interval_hours), 168))


def _month_start(value: date) -> date:
    return value.replace(day=1)


def _shift_month(reference: date, offset: int) -> date:
    month_index = reference.year * 12 + reference.month - 1 + offset
    return date(month_index // 12, month_index % 12 + 1, 1)


def _event_date(month: date, preferred_day: int) -> date:
    today = date.today()

    if month.year == today.year and month.month == today.month:
        preferred_day = min(preferred_day, today.day)

    return date(month.year, month.month, max(1, min(preferred_day, 28)))


def _event_datetime(month: date, day: int, hour: int) -> datetime:
    return datetime.combine(_event_date(month, day), time(hour, 0))


def _find_profile(tenant_key: str) -> dict[str, Any]:
    profile = PROFILE_BY_KEY.get(tenant_key)

    if profile is None:
        raise ValueError(f"Unknown public demo tenant: {tenant_key}")

    return profile


def _get_or_create_workspace(
    db: Session,
    profile: dict[str, Any],
) -> tuple[Organization, User, PublicDemoTenant]:
    tenant = (
        db.query(PublicDemoTenant)
        .filter(PublicDemoTenant.tenant_key == profile["tenant_key"])
        .one_or_none()
    )

    if tenant is not None:
        organization = db.get(Organization, tenant.organization_id)
        user = db.get(User, tenant.user_id)

        if organization is None or user is None:
            raise RuntimeError(
                f"Public demo tenant {profile['tenant_key']} has broken references."
            )

        return organization, user, tenant

    existing_organization = (
        db.query(Organization)
        .filter(Organization.name == profile["organization_name"])
        .one_or_none()
    )

    if existing_organization is not None:
        raise RuntimeError(
            f"Organization name {profile['organization_name']} already exists "
            "without a public demo registry entry."
        )

    existing_user = (
        db.query(User)
        .filter(User.email == profile["user_email"])
        .one_or_none()
    )

    if existing_user is not None:
        raise RuntimeError(
            f"User email {profile['user_email']} already exists "
            "without a public demo registry entry."
        )

    organization = Organization(
        name=profile["organization_name"],
        is_active=True,
    )

    user = User(
        full_name=profile["user_name"],
        email=profile["user_email"],
        hashed_password=get_password_hash(token_urlsafe(32)),
        role="owner",
        is_active=True,
    )

    db.add_all([organization, user])
    db.flush()

    membership = OrganizationMember(
        organization_id=organization.id,
        user_id=user.id,
        role="owner",
        is_active=True,
    )

    tenant = PublicDemoTenant(
        tenant_key=profile["tenant_key"],
        organization_id=organization.id,
        user_id=user.id,
        display_name=profile["display_name"],
        industry=profile["industry"],
        reset_interval_hours=_reset_interval_hours(),
        is_active=True,
    )

    db.add_all([membership, tenant])
    db.flush()

    return organization, user, tenant


def _clear_tenant_business_data(
    db: Session,
    organization_id: int,
) -> None:
    db.query(StockMovement).filter(
        StockMovement.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.query(FinancialTransaction).filter(
        FinancialTransaction.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.query(Product).filter(
        Product.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.query(ProductCategory).filter(
        ProductCategory.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.query(ExpenseCategory).filter(
        ExpenseCategory.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.query(Supplier).filter(
        Supplier.organization_id == organization_id
    ).delete(synchronize_session=False)

    db.flush()


def _record_movement(
    db: Session,
    *,
    organization_id: int,
    product: Product,
    movement_type: str,
    quantity: int,
    reason: str,
    created_by_id: int,
    created_at: datetime,
) -> None:
    previous_stock = int(product.current_stock)

    if movement_type == "stock_in":
        new_stock = previous_stock + quantity
    elif movement_type == "stock_out":
        new_stock = previous_stock - quantity
    else:
        new_stock = previous_stock + quantity

    if new_stock < 0:
        raise RuntimeError(
            f"Demo profile would make product {product.sku} stock negative."
        )

    db.add(
        StockMovement(
            organization_id=organization_id,
            product_id=product.id,
            movement_type=movement_type,
            quantity=quantity,
            previous_stock=previous_stock,
            new_stock=new_stock,
            reason=reason,
            created_by_id=created_by_id,
            created_at=created_at,
        )
    )

    product.current_stock = new_stock
    product.version += 1


def _seed_tenant_business_data(
    db: Session,
    *,
    tenant: PublicDemoTenant,
    profile: dict[str, Any],
) -> None:
    organization_id = tenant.organization_id
    created_by_id = tenant.user_id

    categories = {}

    for name in profile["product_categories"]:
        category = ProductCategory(
            organization_id=organization_id,
            name=name,
            description="Public demo baseline data",
            is_active=True,
        )
        db.add(category)
        categories[name] = category

    expense_categories = {}

    for name in profile["expense_categories"]:
        category = ExpenseCategory(
            organization_id=organization_id,
            name=name,
            description="Public demo baseline data",
            is_active=True,
        )
        db.add(category)
        expense_categories[name] = category

    suppliers = {}

    for index, name in enumerate(profile["suppliers"], start=1):
        supplier = Supplier(
            organization_id=organization_id,
            name=name,
            contact_person=f"Demo Contact {index}",
            phone=f"01700000{index:03d}",
            email=f"demo{index}@stockflow-demo.com",
            address="Public StockFlow demonstration workspace",
            is_active=True,
        )
        db.add(supplier)
        suppliers[name] = supplier

    db.flush()

    products: list[tuple[Product, dict[str, Any]]] = []

    for definition in profile["products"]:
        product = Product(
            organization_id=organization_id,
            name=definition["name"],
            sku=definition["sku"],
            description="Editable public demo product; automatically reset.",
            category_id=categories[definition["category"]].id,
            supplier_id=suppliers[definition["supplier"]].id,
            purchase_price=Decimal(definition["purchase_price"]),
            selling_price=Decimal(definition["selling_price"]),
            current_stock=0,
            low_stock_threshold=definition["threshold"],
            version=1,
            is_active=True,
        )
        db.add(product)
        products.append((product, definition))

    db.flush()

    first_month = _shift_month(_month_start(date.today()), -11)
    months = [
        _shift_month(first_month, offset)
        for offset in range(12)
    ]

    for month_index, month in enumerate(months):
        for product, definition in products:
            stock_in = (
                definition["base_in"]
                + ((month_index + definition["offset"]) % 4) * definition["in_step"]
            )

            stock_out = min(
                product.current_stock + stock_in,
                definition["base_out"]
                + ((month_index + definition["offset"]) % 3) * definition["out_step"],
            )

            _record_movement(
                db,
                organization_id=organization_id,
                product=product,
                movement_type="stock_in",
                quantity=stock_in,
                reason=f"Demo supplier restock - {month.strftime('%b %Y')}",
                created_by_id=created_by_id,
                created_at=_event_datetime(month, 5, 9),
            )

            _record_movement(
                db,
                organization_id=organization_id,
                product=product,
                movement_type="stock_out",
                quantity=stock_out,
                reason=f"Demo customer fulfillment - {month.strftime('%b %Y')}",
                created_by_id=created_by_id,
                created_at=_event_datetime(month, 20, 14),
            )

    last_month = months[-1]

    for product, definition in products:
        adjustment = definition["target_stock"] - product.current_stock

        if adjustment:
            _record_movement(
                db,
                organization_id=organization_id,
                product=product,
                movement_type="adjustment",
                quantity=adjustment,
                reason="Demo period-end stock reconciliation",
                created_by_id=created_by_id,
                created_at=_event_datetime(last_month, 28, 17),
            )

    income_adjustments = (0, 1200, -900, 2600, 700, -400, 1900, 1100, -650, 2300, 800, 3100)

    for month_index, month in enumerate(months):
        month_label = month.strftime("%b %Y")
        transaction_date = _event_date(month, 26)

        income = Decimal(
            profile["income_base"]
            + month_index * profile["income_growth"]
            + income_adjustments[month_index]
        )

        expenses = (
            (
                "Operations",
                Decimal("9800.00") + month_index * 110,
                profile["expense_categories"][0],
            ),
            (
                "Utilities",
                Decimal("2700.00") + (month_index % 4) * 260,
                profile["expense_categories"][2],
            ),
            (
                "Logistics",
                Decimal("1850.00") + (month_index % 3) * 210,
                profile["expense_categories"][1],
            ),
        )

        db.add(
            FinancialTransaction(
                organization_id=organization_id,
                transaction_type="income",
                title=f"Demo sales collection - {month_label}",
                amount=income,
                transaction_date=transaction_date,
                description="Editable public demo baseline",
                created_by_id=created_by_id,
            )
        )

        for label, amount, category_name in expenses:
            db.add(
                FinancialTransaction(
                    organization_id=organization_id,
                    transaction_type="expense",
                    title=f"Demo {label.lower()} expense - {month_label}",
                    amount=amount,
                    transaction_date=transaction_date,
                    expense_category_id=expense_categories[category_name].id,
                    description="Editable public demo baseline",
                    created_by_id=created_by_id,
                )
            )

        if month_index % 3 == 1:
            db.add(
                FinancialTransaction(
                    organization_id=organization_id,
                    transaction_type="expense",
                    title=f"Demo campaign expense - {month_label}",
                    amount=Decimal("3600.00"),
                    transaction_date=transaction_date,
                    expense_category_id=expense_categories[
                        profile["expense_categories"][3]
                    ].id,
                    description="Editable public demo baseline",
                    created_by_id=created_by_id,
                )
            )

    db.flush()


def _reset_tenant(
    db: Session,
    tenant: PublicDemoTenant,
) -> None:
    profile = _find_profile(tenant.tenant_key)

    _clear_tenant_business_data(
        db,
        tenant.organization_id,
    )

    _seed_tenant_business_data(
        db,
        tenant=tenant,
        profile=profile,
    )

    tenant.display_name = profile["display_name"]
    tenant.industry = profile["industry"]
    tenant.reset_interval_hours = _reset_interval_hours()
    tenant.last_reset_at = datetime.utcnow()
    tenant.is_active = True


def _is_reset_due(tenant: PublicDemoTenant) -> bool:
    if tenant.last_reset_at is None:
        return True

    return datetime.utcnow() >= (
        tenant.last_reset_at
        + timedelta(hours=_reset_interval_hours())
    )


def bootstrap_public_demo_tenants(
    db: Session,
) -> list[PublicDemoTenant]:
    tenants = []

    for profile in PUBLIC_DEMO_PROFILES:
        _, _, tenant = _get_or_create_workspace(
            db,
            profile,
        )

        _reset_tenant(
            db,
            tenant,
        )

        tenants.append(tenant)

    db.commit()

    return tenants


def get_or_reset_public_demo_tenant(
    db: Session,
    tenant_key: str,
) -> PublicDemoTenant | None:
    tenant = (
        db.query(PublicDemoTenant)
        .filter(
            PublicDemoTenant.tenant_key == tenant_key,
            PublicDemoTenant.is_active.is_(True),
        )
        .with_for_update()
        .one_or_none()
    )

    if tenant is None:
        return None

    tenant.reset_interval_hours = _reset_interval_hours()

    if _is_reset_due(tenant):
        _reset_tenant(db, tenant)

    db.commit()

    return tenant


def reset_due_public_demo_tenants(
    db: Session,
    *,
    force: bool = False,
) -> list[str]:
    tenant_ids = [
        tenant_id
        for (tenant_id,) in (
            db.query(PublicDemoTenant.id)
            .filter(PublicDemoTenant.is_active.is_(True))
            .order_by(PublicDemoTenant.id.asc())
            .all()
        )
    ]

    reset_tenants = []

    for tenant_id in tenant_ids:
        tenant = (
            db.query(PublicDemoTenant)
            .filter(PublicDemoTenant.id == tenant_id)
            .with_for_update()
            .one()
        )

        tenant.reset_interval_hours = _reset_interval_hours()

        if force or _is_reset_due(tenant):
            _reset_tenant(db, tenant)
            reset_tenants.append(tenant.tenant_key)

    if reset_tenants:
        db.commit()

    return reset_tenants
