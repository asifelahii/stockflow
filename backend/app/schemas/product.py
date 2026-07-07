from datetime import date, datetime
from decimal import Decimal
from typing import Literal
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


DiscountType = Literal["none", "percentage", "fixed"]


class ProductFieldEntry(BaseModel):
    """A user-defined product attribute or specification entry."""

    name: str = Field(..., min_length=1, max_length=80)
    value: str = Field(..., min_length=1, max_length=240)

    model_config = ConfigDict(extra="forbid")

    @field_validator("name", "value")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = value.strip()

        if not normalized:
            raise ValueError("Attribute names and values cannot be blank")

        return normalized


def normalize_optional_text(value: str | None) -> str | None:
    if value is None:
        return None

    normalized = value.strip()
    return normalized or None


def validate_image_url(value: str | None) -> str | None:
    normalized = normalize_optional_text(value)

    if normalized is None:
        return None

    parsed = urlparse(normalized)

    if parsed.scheme not in {"https", "http"} or not parsed.netloc:
        raise ValueError("Image URL must use http or https")

    return normalized


def validate_product_field_entries(
    entries: list[ProductFieldEntry],
    field_label: str,
) -> list[ProductFieldEntry]:
    seen_names: set[str] = set()

    for entry in entries:
        normalized_name = entry.name.casefold()

        if normalized_name in seen_names:
            raise ValueError(f"{field_label} cannot contain duplicate names")

        seen_names.add(normalized_name)

    return entries


def normalize_image_public_id(value: str | None) -> str | None:
    normalized = normalize_optional_text(value)

    if normalized is None:
        return None

    if len(normalized) > 512:
        raise ValueError("Image storage reference is too long")

    return normalized


def validate_image_public_ids(image_public_ids: list[str | None]) -> list[str | None]:
    return [normalize_image_public_id(public_id) for public_id in image_public_ids]


def validate_image_urls(image_urls: list[str]) -> list[str]:
    normalized_urls: list[str] = []
    seen_urls: set[str] = set()

    for image_url in image_urls:
        normalized = validate_image_url(image_url)

        if normalized is None:
            raise ValueError("Additional image URLs cannot be blank")

        if normalized in seen_urls:
            raise ValueError("Additional image URLs cannot contain duplicates")

        seen_urls.add(normalized)
        normalized_urls.append(normalized)

    return normalized_urls


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    sku: str = Field(..., min_length=2, max_length=100)

    short_description: str | None = Field(default=None, max_length=300)
    description: str | None = Field(default=None, max_length=5000)
    image_url: str | None = Field(default=None, max_length=2048)
    image_public_id: str | None = Field(default=None, max_length=512)
    image_urls: list[str] = Field(default_factory=list, max_length=5)
    image_public_ids: list[str | None] = Field(default_factory=list, max_length=5)

    category_id: int | None = None
    supplier_id: int | None = None
    release_year: int | None = Field(default=None, ge=1900, le=2100)
    is_featured: bool = False

    purchase_price: Decimal = Field(default=Decimal("0"), ge=0)
    selling_price: Decimal = Field(default=Decimal("0"), ge=0)

    discount_type: DiscountType = "none"
    discount_value: Decimal = Field(default=Decimal("0"), ge=0)
    offer_starts_on: date | None = None
    offer_ends_on: date | None = None

    tax_rate: Decimal = Field(default=Decimal("0"), ge=0, le=100)
    shipping_fee: Decimal = Field(default=Decimal("0"), ge=0)
    additional_cost: Decimal = Field(default=Decimal("0"), ge=0)

    attributes: list[ProductFieldEntry] = Field(default_factory=list, max_length=30)
    specifications: list[ProductFieldEntry] = Field(default_factory=list, max_length=50)

    current_stock: int = Field(default=0, ge=0)
    low_stock_threshold: int = Field(default=0, ge=0)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()

        if not normalized:
            raise ValueError("Product name cannot be blank")

        return normalized

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str) -> str:
        normalized = value.strip().upper()

        if not normalized:
            raise ValueError("SKU cannot be blank")

        return normalized

    @field_validator("short_description", "description", mode="before")
    @classmethod
    def normalize_optional_copy(cls, value: str | None) -> str | None:
        return normalize_optional_text(value)

    @field_validator("image_url")
    @classmethod
    def validate_primary_image_url(cls, value: str | None) -> str | None:
        return validate_image_url(value)

    @field_validator("image_public_id")
    @classmethod
    def validate_primary_image_public_id(cls, value: str | None) -> str | None:
        return normalize_image_public_id(value)

    @field_validator("image_urls")
    @classmethod
    def validate_additional_image_urls(cls, value: list[str]) -> list[str]:
        return validate_image_urls(value)

    @field_validator("image_public_ids")
    @classmethod
    def validate_additional_image_public_ids(
        cls,
        value: list[str | None],
    ) -> list[str | None]:
        return validate_image_public_ids(value)

    @field_validator("attributes")
    @classmethod
    def validate_attributes(
        cls,
        value: list[ProductFieldEntry],
    ) -> list[ProductFieldEntry]:
        return validate_product_field_entries(value, "Attributes")

    @field_validator("specifications")
    @classmethod
    def validate_specifications(
        cls,
        value: list[ProductFieldEntry],
    ) -> list[ProductFieldEntry]:
        return validate_product_field_entries(value, "Specifications")

    @model_validator(mode="after")
    def validate_catalog_pricing(self):
        if self.image_url is None and self.image_public_id is not None:
            raise ValueError("Primary image storage reference requires a primary image")

        if len(self.image_urls) != len(self.image_public_ids):
            raise ValueError("Each gallery image must have a matching storage reference")

        if (
            self.offer_starts_on is not None
            and self.offer_ends_on is not None
            and self.offer_starts_on > self.offer_ends_on
        ):
            raise ValueError("Offer end date must be on or after the start date")

        if self.discount_type == "none":
            if self.discount_value != 0:
                raise ValueError("Discount value must be zero when no offer is selected")

            if self.offer_starts_on is not None or self.offer_ends_on is not None:
                raise ValueError("Offer dates require a percentage or fixed offer")

        if self.discount_type in {"percentage", "fixed"} and self.discount_value <= 0:
            raise ValueError("Offer value must be greater than zero when an offer is selected")

        if self.discount_type == "percentage" and self.discount_value > 100:
            raise ValueError("Percentage discount cannot exceed 100")

        if self.discount_type == "fixed" and self.discount_value > self.selling_price:
            raise ValueError("Fixed discount cannot exceed the selling price")

        return self


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    """Partial product update. Complete catalogue validation runs after state is merged."""

    version: int = Field(..., ge=1)

    name: str | None = Field(default=None, min_length=2, max_length=150)
    sku: str | None = Field(default=None, min_length=2, max_length=100)

    short_description: str | None = Field(default=None, max_length=300)
    description: str | None = Field(default=None, max_length=5000)
    image_url: str | None = Field(default=None, max_length=2048)
    image_public_id: str | None = Field(default=None, max_length=512)
    image_urls: list[str] | None = Field(default=None, max_length=5)
    image_public_ids: list[str | None] | None = Field(default=None, max_length=5)

    category_id: int | None = None
    supplier_id: int | None = None
    release_year: int | None = Field(default=None, ge=1900, le=2100)
    is_featured: bool | None = None

    purchase_price: Decimal | None = Field(default=None, ge=0)
    selling_price: Decimal | None = Field(default=None, ge=0)

    discount_type: DiscountType | None = None
    discount_value: Decimal | None = Field(default=None, ge=0)
    offer_starts_on: date | None = None
    offer_ends_on: date | None = None

    tax_rate: Decimal | None = Field(default=None, ge=0, le=100)
    shipping_fee: Decimal | None = Field(default=None, ge=0)
    additional_cost: Decimal | None = Field(default=None, ge=0)

    attributes: list[ProductFieldEntry] | None = Field(default=None, max_length=30)
    specifications: list[ProductFieldEntry] | None = Field(default=None, max_length=50)

    low_stock_threshold: int | None = Field(default=None, ge=0)
    is_active: bool | None = None

    model_config = ConfigDict(extra="forbid")

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        return normalize_optional_text(value)

    @field_validator("sku")
    @classmethod
    def normalize_sku(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized = value.strip().upper()

        if not normalized:
            raise ValueError("SKU cannot be blank")

        return normalized

    @field_validator("short_description", "description", mode="before")
    @classmethod
    def normalize_optional_copy(cls, value: str | None) -> str | None:
        return normalize_optional_text(value)

    @field_validator("image_url")
    @classmethod
    def validate_primary_image_url(cls, value: str | None) -> str | None:
        return validate_image_url(value)

    @field_validator("image_public_id")
    @classmethod
    def validate_primary_image_public_id(cls, value: str | None) -> str | None:
        return normalize_image_public_id(value)

    @field_validator("image_urls")
    @classmethod
    def validate_additional_image_urls(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None

        return validate_image_urls(value)

    @field_validator("image_public_ids")
    @classmethod
    def validate_additional_image_public_ids(
        cls,
        value: list[str | None] | None,
    ) -> list[str | None] | None:
        if value is None:
            return None

        return validate_image_public_ids(value)

    @field_validator("attributes")
    @classmethod
    def validate_attributes(
        cls,
        value: list[ProductFieldEntry] | None,
    ) -> list[ProductFieldEntry] | None:
        if value is None:
            return None

        return validate_product_field_entries(value, "Attributes")

    @field_validator("specifications")
    @classmethod
    def validate_specifications(
        cls,
        value: list[ProductFieldEntry] | None,
    ) -> list[ProductFieldEntry] | None:
        if value is None:
            return None

        return validate_product_field_entries(value, "Specifications")


class ProductResponse(ProductBase):
    id: int
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductMediaUploadResponse(BaseModel):
    url: str
    public_id: str
    width: int = Field(ge=1)
    height: int = Field(ge=1)
    bytes: int = Field(ge=1)
    format: str


class ProductMediaDeleteRequest(BaseModel):
    public_ids: list[str] = Field(..., min_length=1, max_length=6)

    @field_validator("public_ids")
    @classmethod
    def normalize_public_ids(cls, values: list[str]) -> list[str]:
        normalized_values = [normalize_image_public_id(value) for value in values]

        if any(value is None for value in normalized_values):
            raise ValueError("Image storage references cannot be blank")

        clean_values = [value for value in normalized_values if value is not None]

        if len(clean_values) != len(set(clean_values)):
            raise ValueError("Image storage references cannot contain duplicates")

        return clean_values
