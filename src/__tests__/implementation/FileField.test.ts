import path from 'path'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import { FileFieldValue } from '../../fields/FileField.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildSchema from '../../utilities/buildSchema'

interface FileDetailExpectations {
	expectedName: string
	expectedType: string
	expectedExtension: string
}

enum EnvKind {
	Linux = 'linux',
	Windows = 'windows',
}

const linuxTestPath = '/some/directory/path'
const windowsTestPath = 'C:\\some\\directory\\path'

export default class FileFieldTest extends AbstractSpruceTest {
	private static fileDefinition = buildSchema({
		id: 'testFeature',
		name: 'Test Feature',
		fields: {
			target: {
				type: 'file',
				isRequired: true,
				label: 'What file would you like to test?',
			},
		},
	})

	@test('Can get .ts details', '/does/not/need/to/exist/TestFile.ts', {
		expectedName: 'TestFile.ts',
		expectedType: 'application/typescript',
		expectedExtension: '.ts',
	})
	@test('Can get .js details', '/does/not/need/to/exist/TestFile.js', {
		expectedName: 'TestFile.js',
		expectedType: 'application/javascript',
		expectedExtension: '.js',
	})
	@test('Can get .png details', '/does/not/need/to/exist/avatar.png', {
		expectedName: 'avatar.png',
		expectedType: 'image/png',
		expectedExtension: '.png',
	})
	public static testGettingFileDetails(
		filePath: string,
		expectations: FileDetailExpectations
	) {
		const field = FieldFactory.Field('test', {
			type: 'file',
		})

		const file = field.toValueType(filePath)

		assert.isEqual(
			file.name,
			expectations.expectedName,
			'File name did not parse as expected'
		)

		assert.isEqual(
			file.type,
			expectations.expectedType,
			'File type did not lookup as expected'
		)

		assert.isEqual(
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
			path: undefined,
		}
	)
	@test(
		'Can get file value based on only path',
		{ path: '/path/to/a/non/existent/file/isTruthy/NewFile.ts' },
		{
			name: 'NewFile.ts',
			ext: '.ts',
			type: 'application/typescript',
			path: '/path/to/a/non/existent/file/isTruthy',
		}
	)
	public static testCompletingFileObject(
		partial: Partial<FileFieldValue>,
		complete: FileFieldValue
	) {
		const file = FieldFactory.Field('test', { type: 'file' })
		const augmented = file.toValueType(partial)
		assert.isEqualDeep(augmented, complete)
	}

	@test(
		'Can create schema and properly parse path set path',
		EnvKind.Linux,
		linuxTestPath,
		{
			path: linuxTestPath,
			ext: '.ts',
			type: 'application/typescript',
			name: 'test.ts',
		}
	)
	@test(
		'Can create schema and properly parse path set path by name',
		EnvKind.Linux,
		linuxTestPath,
		{
			name: `${linuxTestPath}/test.ts`,
		}
	)
	@test(
		'Can create schema and properly parse path set as string',
		EnvKind.Linux,
		linuxTestPath,
		`${linuxTestPath}/test.ts`
	)
	@test(
		'Can create schema and properly parse path set path in windows',
		EnvKind.Windows,
		windowsTestPath,
		{
			path: windowsTestPath,
			ext: '.ts',
			type: 'application/typescript',
			name: 'test.ts',
		}
	)
	@test(
		'Can create schema and properly parse path set path by name in windows',
		EnvKind.Windows,
		windowsTestPath,
		{
			name: `${windowsTestPath}\\test.ts`,
		}
	)
	@test(
		'Can create schema and properly parse path set as string in windows',
		EnvKind.Windows,
		windowsTestPath,
		`${windowsTestPath}/test.ts`
	)
	public static testInSchema(
		env: EnvKind,
		expectedPath: string,
		setTarget: FileFieldValue
	) {
		if (env === EnvKind.Linux) {
			// @ts-ignore
			path.sep = '/'
		} else if (env === EnvKind.Windows) {
			// @ts-ignore
			path.sep = '\\'
		}
		const schema = new StaticSchemaEntityImplementation(this.fileDefinition)

		schema.set('target', setTarget)

		const values = schema.getValues({
			fields: ['target'],
		})

		assert.isTruthy(values.target)
		assert.isEqual(values.target.path, expectedPath)
	}

	@test(
		'can get paths relative to provided relativeTo',
		'/home/user/test/me',
		'/home/user',
		'test/me'
	)
	@test(
		'can get paths relative to provided relativeTo going back',
		'/home/user/test/me',
		'/home/user/tacos',
		'../test/me'
	)
	protected static testGettingRelativePath(
		path: string,
		relativeTo: string,
		expectedPath: string
	) {
		const schema = new StaticSchemaEntityImplementation(this.fileDefinition)
		schema.set('target', { path, name: 'app.ts' })
		const target = schema.get('target', { byField: { target: { relativeTo } } })
		assert.isEqual(target.path, expectedPath)
	}
}
