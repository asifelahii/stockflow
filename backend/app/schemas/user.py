from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)
    organization_name: str = Field(..., min_length=2, max_length=150)
    turnstile_token: str | None = None

    @field_validator("organization_name")
    @classmethod
    def normalize_organization_name(cls, value: str) -> str:
        normalized_value = value.strip()

        if len(normalized_value) < 2:
            raise ValueError("Business name must contain at least 2 characters.")

        return normalized_value


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrganizationSummary(BaseModel):
    id: int
    name: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    organization: OrganizationSummary


class TokenPayload(BaseModel):
    sub: str | None = None
    organization_id: int | None = None
    organization_role: str | None = None
