export const ALLOWED_COURSE_FIELDS = new Map<string, string>();
ALLOWED_COURSE_FIELDS.set("id", "c.id");
ALLOWED_COURSE_FIELDS.set("name", "c.name");
ALLOWED_COURSE_FIELDS.set("session_id", "c.session_id");
ALLOWED_COURSE_FIELDS.set("session_name", "s.name AS session_name");
ALLOWED_COURSE_FIELDS.set("payment_mode", "c.payment_mode");
ALLOWED_COURSE_FIELDS.set("duration", "c.duration");
ALLOWED_COURSE_FIELDS.set("price", "c.price");
ALLOWED_COURSE_FIELDS.set("description", "c.description");
ALLOWED_COURSE_FIELDS.set("created_at", "c.created_at");
ALLOWED_COURSE_FIELDS.set("is_active", "c.is_active");


export const ALLOWED_BATCH_FIELDS = new Map<string, string>();
ALLOWED_BATCH_FIELDS.set("id", "b.id")
ALLOWED_BATCH_FIELDS.set("course_id", "b.course_id")
ALLOWED_BATCH_FIELDS.set("session_id", "b.session_id")
ALLOWED_BATCH_FIELDS.set("month_name", "b.month_name")
ALLOWED_BATCH_FIELDS.set("is_active", "b.is_active")
ALLOWED_BATCH_FIELDS.set("created_at", "b.created_at")

ALLOWED_BATCH_FIELDS.set("session_name", "s.name AS session_name")
ALLOWED_BATCH_FIELDS.set("course_name", "c.name AS course_name")

