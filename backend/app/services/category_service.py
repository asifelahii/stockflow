from sqlalchemy.orm import Session

from app.models.category import ExpenseCategory, ProductCategory
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_product_category_by_id(
    db: Session,
    category_id: int,
    include_inactive: bool = False,
) -> ProductCategory | None:
    query = db.query(ProductCategory).filter(ProductCategory.id == category_id)

    if not include_inactive:
        query = query.filter(ProductCategory.is_active.is_(True))

    return query.first()


def get_product_category_by_name(db: Session, name: str) -> ProductCategory | None:
    return db.query(ProductCategory).filter(ProductCategory.name == name).first()


def get_product_categories(db: Session) -> list[ProductCategory]:
    return (
        db.query(ProductCategory)
        .order_by(ProductCategory.id.desc())
        .all()
    )


def create_product_category(
    db: Session,
    category_data: CategoryCreate,
) -> ProductCategory:
    category = ProductCategory(**category_data.model_dump())

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def update_product_category(
    db: Session,
    category: ProductCategory,
    category_data: CategoryUpdate,
) -> ProductCategory:
    update_data = category_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


def delete_product_category(db: Session, category: ProductCategory) -> ProductCategory:
    category.is_active = False

    db.commit()
    db.refresh(category)

    return category


def get_expense_category_by_id(
    db: Session,
    category_id: int,
    include_inactive: bool = False,
) -> ExpenseCategory | None:
    query = db.query(ExpenseCategory).filter(ExpenseCategory.id == category_id)

    if not include_inactive:
        query = query.filter(ExpenseCategory.is_active.is_(True))

    return query.first()


def get_expense_category_by_name(db: Session, name: str) -> ExpenseCategory | None:
    return db.query(ExpenseCategory).filter(ExpenseCategory.name == name).first()


def get_expense_categories(db: Session) -> list[ExpenseCategory]:
    return (
        db.query(ExpenseCategory)
        .order_by(ExpenseCategory.id.desc())
        .all()
    )


def create_expense_category(
    db: Session,
    category_data: CategoryCreate,
) -> ExpenseCategory:
    category = ExpenseCategory(**category_data.model_dump())

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def update_expense_category(
    db: Session,
    category: ExpenseCategory,
    category_data: CategoryUpdate,
) -> ExpenseCategory:
    update_data = category_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


def delete_expense_category(db: Session, category: ExpenseCategory) -> ExpenseCategory:
    category.is_active = False

    db.commit()
    db.refresh(category)

    return category
