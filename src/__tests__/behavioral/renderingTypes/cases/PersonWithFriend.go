package cases

type SprucePersonWithFriend struct {
	Name    string          `json:"name,omitempty"`
	Friend  *SpruceFriend   `json:"friend,omitempty"`
	Friends *[]SpruceFriend `json:"friends,omitempty"`
}

// split here

type SpruceFriend struct {
	Name string `json:"name,omitempty"`
}
