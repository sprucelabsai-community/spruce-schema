package cases

type RawFields struct {
	ContextAsRecordStringAny map[string]interface{} `json:"contextAsRecordStringAny,omitempty"`
	ContextAsAny             interface{}            `json:"contextAsAny,omitempty"`
}
