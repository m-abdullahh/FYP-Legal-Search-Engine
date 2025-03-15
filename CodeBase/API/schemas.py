from marshmallow import Schema, fields, ValidationError, validates_schema
from marshmallow.validate import OneOf


class GenericSearchSchema(Schema):
    text = fields.String(required=True, load_only=True)
    case_type = fields.String(required=False, load_only=True)


class TrademarkSearchSchema(Schema):
    case_type = fields.String(required=False, load_only=True)
    text = fields.String(required=False, load_only=True, nullable=True)
    section_no = fields.Int(required=False, load_only=True, nullable=True)
    query_type = fields.String(
        validate=OneOf(["text", "section_no"]), required=True, load_only=True
    )

    @validates_schema
    def validate_text_or_section_no(self, data, **kwargs):
        text, section_no = data.get("text"), data.get("section_no")

        if not text and not section_no:
            raise ValidationError(
                "Either 'text' or 'section_no' must be provided, but not both."
            )


class JudgementClassificationSchema(Schema):
    text = fields.String(required=True, load_only=True)


class ChatBotSchema(Schema):
    text = fields.String(required=True, load_only=True)

    # user_id = fields.String(required=False, load_only=True, nullable=True)

    @validates_schema
    def validate_text(self, data, **kwargs):
        text = data.get("text")
        if not text or len(text.strip()) == 0:
            raise ValidationError("The 'text' field cannot be empty.")
