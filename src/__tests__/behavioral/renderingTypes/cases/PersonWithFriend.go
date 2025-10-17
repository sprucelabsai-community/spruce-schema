package cases

type SprucePersonWithFriend struct {
	Name   string        `json:"name,omitempty"`
	Friend *SpruceFriend `json:"friend,omitempty"`
}

// split here

type SpruceFriend struct {
	Name string `json:"name,omitempty"`
}
