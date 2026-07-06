from typing import Literal

from pydantic import BaseModel, Field


OAuthProvider = Literal["google", "facebook", "apple"]


class OAuthTicketExchangeRequest(BaseModel):
    ticket: str = Field(min_length=32, max_length=256)


class OAuthProvidersResponse(BaseModel):
    google: bool
    facebook: bool
    apple: bool
