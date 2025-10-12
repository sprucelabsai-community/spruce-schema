package cases

type FieldsWithHints struct {
	// this is the first hint
	MiddleName string `json:"middleName,omitempty"`
	// this is the second hint
	Title string `json:"title,omitempty"`
}
