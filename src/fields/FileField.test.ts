import BaseTest, { test, ISpruce, assert } from '@sprucelabs/test'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { IFileFieldValue } from './FileField'
import FieldFactory from '../factories/FieldFactory'
import Schema from '../Schema'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'

interface IFileDetailExpectations {
	expectedName: string
	expectedType: string
	expectedExtension: string
}

export default class FileFieldTest extends BaseTest {
	@test('Can get .ts details', '/does/not/need/to/exist/TestFile.ts', {
		expectedName: 'TestFile.ts',
		expectedType: 'application/typescript',
		expectedExtension: '.ts'
	})
	@test('Can get .js details', '/does/not/need/to/exist/TestFile.js', {
		expectedName: 'TestFile.js',
		expectedType: 'application/javascript',
		expectedExtension: '.js'
	})
	@test('Can get .png details', '/does/not/need/to/exist/avatar.png', {
		expectedName: 'avatar.png',
		expectedType: 'image/png',
		expectedExtension: '.png'
	})
	public static testGettingFileDetails(
		spruce: ISpruce,
		filePath: string,
		expectations: IFileDetailExpectations
	) {
		const field = FieldFactory.field('test', {
			type: FieldType.File
		})
		const file = field.toValueType(filePath)

		// Assert our expectations
		// expected name
		assert.equal(
			file.name,
			expectations.expectedName,
			'File name did not parse as expected'
		)

		// Expected type
		assert.equal(
			file.type,
			expectations.expectedType,
			'File type did not lookup as expected'
		)

		// Expected extension
		assert.equal(
			file.ext,
			expectations.expectedExtension,
			'File type did not lookup as expected'
		)
	}

	@test(
		'Can get file value based on only name',
		{ name: 'NewFile.ts' },
		{
			name: 'NewFile.ts',
			ext: '.ts',
			type: 'application/typescript',
			path: undefined
		}
	)
	@test(
		'Can get file value based on only path',
		{ path: '/path/to/a/non/existent/file/isOk/NewFile.ts' },
		{
			name: 'NewFile.ts',
			ext: '.ts',
			type: 'application/typescript',
			path: '/path/to/a/non/existent/file/isOk'
		}
	)
	public static testCompletingFileObject(
		spruce: ISpruce,
		partial: Partial<IFileFieldValue>,
		complete: IFileFieldValue
	) {
		const file = FieldFactory.field('test', { type: FieldType.File })
		const augmented = file.toValueType(partial)
		assert.deepEqual(augmented, complete)
	}

	@test('Can create schema and properly parse path of target')
	public static testInSchema() {
		const expectedPath = process.cwd()

		const fileDefinition = buildSchemaDefinition({
			id: 'testFeature',
			name: 'Test Feature',
			fields: {
				target: {
					type: FieldType.File,
					isRequired: true,
					label: 'What file would you like to test?'
				}
			}
		})

		const schema = new Schema(fileDefinition)

		schema.set('target', {
			path: expectedPath,
			ext: '.ts',
			type: 'application/typescript',
			name: 'test.ts'
		})

		const values = schema.getValues({
			fields: ['target']
		})

		assert.isOk(values.target)
		assert.equal(values.target.path, expectedPath)
	}
}
