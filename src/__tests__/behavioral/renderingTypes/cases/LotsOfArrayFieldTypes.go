package cases

import SpruceSchema "github.com/sprucelabsai-community/spruce-schema/pkg/fields"

// Person: A human being.
type LotsOfArrayFieldTypes struct {
	Id        []string `json:"id" validate:"required,min=1"`
	FirstName []string `json:"firstName,omitempty"`
	LastName  []string `json:"lastName,omitempty"`
	// The name you can use when talking to this person.
	CasualName []string `json:"casualName" validate:"required,min=1"`
	Timezone   []string `json:"timezone,omitempty"`
	// A number that can be texted
	Phone []string `json:"phone,omitempty"`
	// An optional username if the person does not want to login using their phone
	Username []string `json:"username,omitempty"`
	// An optional email if the person does not want to login using their phone
	Email           []string                          `json:"email,omitempty"`
	Avatar          []SpruceSchema.ImageFieldValue    `json:"avatar,omitempty"`
	DateCreated     []SpruceSchema.DateTimeFieldValue `json:"dateCreated" validate:"required,min=1"`
	DateUpdated     []SpruceSchema.DateTimeFieldValue `json:"dateUpdated,omitempty"`
	DateScrambled   []SpruceSchema.DateTimeFieldValue `json:"dateScrambled,omitempty"`
	ArrayOfBooleans []bool                            `json:"arrayOfBooleans,omitempty"`
}
