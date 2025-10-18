package cases

// A schema with fields that have hints
type FieldsWithHints struct {
	// this is the first hint
	MiddleName string `json:"middleName,omitempty"`
	// this is the second hint
	Title string `json:"title,omitempty"`
}
