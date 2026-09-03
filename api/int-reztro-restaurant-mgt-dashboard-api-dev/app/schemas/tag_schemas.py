from pydantic import BaseModel, Field


# CREATE TAG

class TagCreate(BaseModel):

    tag_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

# UPDATE TAG

class TagUpdate(BaseModel):

    tag_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )