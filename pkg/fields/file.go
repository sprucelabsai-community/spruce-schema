package fields

type SupportedFileType string

var SupportedFileTypes = []SupportedFileType{
	// Images
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
	"image/svg+xml",
	"image/bmp",
	"image/tiff",
	"image/heic",

	// Video
	"video/mp4",
	"video/webm",
	"video/quicktime",
	"video/x-msvideo",
	"video/x-matroska",

	// Audio
	"audio/mpeg",
	"audio/wav",
	"audio/ogg",
	"audio/aac",

	// Documents
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"text/plain",
	"text/csv",
	"application/rtf",

	// Archives
	"application/zip",
	"application/x-tar",
	"application/x-7z-compressed",
	"application/x-rar-compressed",

	// Wildcards
	"image/*",
	"video/*",
	"audio/*",
	"*",
}

type FileFieldValue struct {
	Name       string            `json:"name"`
	ID         string            `json:"id,omitempty"`
	Type       SupportedFileType `json:"type,omitempty"`
	URI        string            `json:"uri,omitempty"`
	Base64     string            `json:"base64,omitempty"`
	PreviewURL string            `json:"previewUrl,omitempty"`
}
