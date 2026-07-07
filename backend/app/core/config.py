from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "StockFlow API"
    app_env: str = "development"
    debug: bool = False

    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/stockflow"

    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    turnstile_secret_key: str = ""
    # Public, fully editable multi-tenant sandbox.
    public_demo_enabled: bool = False
    demo_reset_interval_hours: int = 24
    demo_reset_secret: str = ""

    # Social OAuth. Provider secrets belong only in local/hosting environment settings.
    frontend_url: str = "http://localhost:4200"
    public_api_base_url: str = "http://127.0.0.1:8000"

    oauth_state_ttl_minutes: int = 10
    oauth_ticket_ttl_minutes: int = 2

    google_oauth_client_id: str = ""
    google_oauth_client_secret: str = ""

    facebook_oauth_client_id: str = ""
    facebook_oauth_client_secret: str = ""
    facebook_graph_api_version: str = "v22.0"

    apple_oauth_client_id: str = ""
    apple_oauth_team_id: str = ""
    apple_oauth_key_id: str = ""
    apple_oauth_private_key: str = ""

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    product_image_upload_max_mb: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
