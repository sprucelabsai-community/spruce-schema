package fields

type RequiredImageSize string

var RequiredImageSizes = []RequiredImageSize{"s", "m", "l", "xl", "*"}

type ImageFieldValue struct {
	Name   string            `json:"name"`
	ID     string            `json:"id,omitempty"`
	Base64 string            `json:"base64,omitempty"`
	Type   SupportedFileType `json:"type,omitempty"`
	SURI   string            `json:"sUri,omitempty"`
	MURI   string            `json:"mUri,omitempty"`
	LURI   string            `json:"lUri,omitempty"`
	XLURI  string            `json:"xlUri,omitempty"`
}
