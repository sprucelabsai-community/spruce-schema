package fields

type SelectValue any

type SelectChoice struct {
	Value SelectValue `json:"value"`
	Label string      `json:"label"`
}

type SelectFieldValue any
