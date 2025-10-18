import buildSchema from '../../../../utilities/buildSchema'

export default buildSchema({
    id: 'lotsOfArrayFieldTypes',
    name: 'Person',
    description: 'A human being.',
    fields: {
        id: {
            label: 'Id',
            type: 'id',
            isRequired: true,
            isArray: true,
        },
        firstName: {
            label: 'First name',
            type: 'text',
            isPrivate: true,
            isArray: true,
        },
        lastName: {
            label: 'Last name',
            type: 'text',
            isPrivate: true,
            isArray: true,
        },
        casualName: {
            label: 'Casual name',
            type: 'text',
            hint: 'The name you can use when talking to this person.',
            isRequired: true,
            isArray: true,
        },
        timezone: {
            label: 'Timezone',
            type: 'select',
            isArray: true,
            options: {
                choices: [
                    {
                        label: 'America/Los_Angeles',
                        value: 'America/Los_Angeles',
                    },
                    {
                        label: 'America/New_York',
                        value: 'America/New_York',
                    },
                ],
            },
        },
        phone: {
            label: 'Phone',
            type: 'phone',
            hint: 'A number that can be texted',
            isPrivate: true,
            isArray: true,
        },
        username: {
            label: 'Username',
            type: 'text',
            hint: 'An optional username if the person does not want to login using their phone',
            isPrivate: true,
            isArray: true,
        },
        email: {
            label: 'Email',
            type: 'email',
            hint: 'An optional email if the person does not want to login using their phone',
            isPrivate: true,
            isArray: true,
        },
        avatar: {
            label: 'Avatar src',
            type: 'image',
            isArray: true,
            options: {
                requiredSizes: ['*'],
            },
        },
        dateCreated: {
            type: 'dateTime',
            isRequired: true,
            isArray: true,
        },
        dateUpdated: {
            type: 'dateTime',
            isArray: true,
        },
        dateScrambled: {
            type: 'dateTime',
            isArray: true,
        },
        arrayOfBooleans: {
            type: 'boolean',
            isArray: true,
        },
    },
})
