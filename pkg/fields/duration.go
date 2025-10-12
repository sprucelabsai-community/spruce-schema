package fields

type DurationFieldValue struct {
	Hours   int `json:"hours"`
	Minutes int `json:"minutes"`
	Seconds int `json:"seconds"`
	Millis  int `json:"ms"`
}
