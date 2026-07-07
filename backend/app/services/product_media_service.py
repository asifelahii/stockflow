from dataclasses import dataclass
from io import BytesIO
from uuid import uuid4

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.core.config import settings


ALLOWED_IMAGE_FORMATS = {
    "JPEG": "jpg",
    "PNG": "png",
    "WEBP": "webp",
}
MAX_IMAGE_PIXELS = 40_000_000


class ProductMediaConfigurationError(Exception):
    pass


class ProductMediaValidationError(Exception):
    pass


class ProductMediaUploadError(Exception):
    pass


@dataclass(frozen=True)
class UploadedProductMedia:
    url: str
    public_id: str
    width: int
    height: int
    bytes: int
    format: str


def _ensure_cloudinary_is_configured() -> None:
    if not (
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret
    ):
        raise ProductMediaConfigurationError(
            "Product image storage is not configured. Set the Cloudinary environment values first."
        )

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


def get_product_media_prefix(organization_id: int) -> str:
    return f"stockflow/products/{organization_id}"


def _read_and_validate_image(file: UploadFile) -> tuple[bytes, int, int, str]:
    maximum_bytes = settings.product_image_upload_max_mb * 1024 * 1024
    content = file.file.read(maximum_bytes + 1)

    if not content:
        raise ProductMediaValidationError("Choose an image file before uploading")

    if len(content) > maximum_bytes:
        raise ProductMediaValidationError(
            f"Image must be {settings.product_image_upload_max_mb} MB or smaller"
        )

    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()

        with Image.open(BytesIO(content)) as image:
            image.load()
            image_format = (image.format or "").upper()
            width, height = image.size
    except (UnidentifiedImageError, OSError, ValueError) as error:
        raise ProductMediaValidationError("The selected file is not a valid image") from error

    if image_format not in ALLOWED_IMAGE_FORMATS:
        raise ProductMediaValidationError("Use a JPG, PNG, or WebP image")

    if width < 1 or height < 1 or width * height > MAX_IMAGE_PIXELS:
        raise ProductMediaValidationError("Image dimensions are not supported")

    return content, width, height, ALLOWED_IMAGE_FORMATS[image_format]


def upload_product_media(organization_id: int, file: UploadFile) -> UploadedProductMedia:
    _ensure_cloudinary_is_configured()
    content, width, height, image_format = _read_and_validate_image(file)

    try:
        result = cloudinary.uploader.upload(
            content,
            resource_type="image",
            folder=get_product_media_prefix(organization_id),
            public_id=f"product-{uuid4().hex}",
            overwrite=False,
            unique_filename=False,
            use_filename=False,
            tags=["stockflow", "product", f"organization-{organization_id}"],
        )
    except Exception as error:
        raise ProductMediaUploadError("Image storage rejected the upload. Please try again.") from error

    secure_url = str(result.get("secure_url") or "")
    public_id = str(result.get("public_id") or "")

    if not secure_url or not public_id:
        raise ProductMediaUploadError("Image storage did not return a usable image reference")

    return UploadedProductMedia(
        url=secure_url,
        public_id=public_id,
        width=int(result.get("width") or width),
        height=int(result.get("height") or height),
        bytes=int(result.get("bytes") or len(content)),
        format=str(result.get("format") or image_format),
    )


def validate_product_media_ownership(
    organization_id: int,
    primary_public_id: str | None,
    gallery_public_ids: list[str | None] | None,
) -> None:
    prefix = f"{get_product_media_prefix(organization_id)}/"
    public_ids = [primary_public_id, *(gallery_public_ids or [])]

    for public_id in public_ids:
        if public_id is not None and not public_id.startswith(prefix):
            raise ProductMediaValidationError("Product images must belong to the active workspace")


def delete_product_media(organization_id: int, public_ids: list[str] | set[str]) -> None:
    unique_public_ids = {public_id for public_id in public_ids if public_id}

    if not unique_public_ids:
        return

    validate_product_media_ownership(organization_id, None, list(unique_public_ids))
    _ensure_cloudinary_is_configured()

    failures: list[str] = []

    for public_id in unique_public_ids:
        try:
            result = cloudinary.uploader.destroy(
                public_id,
                resource_type="image",
                invalidate=True,
            )
        except Exception:
            failures.append(public_id)
            continue

        if result.get("result") not in {"ok", "not found"}:
            failures.append(public_id)

    if failures:
        raise ProductMediaUploadError("Some unused images could not be removed from storage")
