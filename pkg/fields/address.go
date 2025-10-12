package fields

type AddressFieldValue struct {
	Street1  string `json:"street1"`
	Street2  string `json:"street2,omitempty"`
	City     string `json:"city"`
	Province string `json:"province"`
	Country  string `json:"country"`
	ZIP      string `json:"zip"`
}
