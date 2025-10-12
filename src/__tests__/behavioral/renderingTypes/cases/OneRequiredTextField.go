package cases

type OneRequiredTextField struct {
	Name string `json:"name" validate:"required"`
}
