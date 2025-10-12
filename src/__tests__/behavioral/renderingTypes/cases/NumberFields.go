package cases

type NumberFields struct {
	Age            float64   `json:"age,omitempty"`
	LuckyNumbers   []float64 `json:"luckyNumbers" validate:"required,min=1,dive,gte=-5,lte=2"`
	UnluckyNumbers []float64 `json:"unluckyNumbers,omitempty" validate:"min=3,dive,gte=-10,lte=10"`
}
