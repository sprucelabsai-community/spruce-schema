package cases

type PersonWithFriend struct {
	Name    string    `json:"name,omitempty"`
	Friend  *Friend   `json:"friend,omitempty"`
	Friends *[]Friend `json:"friends,omitempty"`
}

// split here

type Friend struct {
	Name string `json:"name,omitempty"`
}
