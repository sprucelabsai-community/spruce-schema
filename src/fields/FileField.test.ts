import BaseTest, { test, ISpruce, assert } from '@sprucelabs/test'
import path from 'path'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { IFileFieldValue } from './FileField'
import FieldFactory from '../factories/FieldFactory'
import Schema from '../Schema'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'
import Spruce from '@sprucelabs/test/build/src/Spruce'

interface IFileDetailExpectations {
	expectedName: string
	expectedType: string
	expectedExtension: string
}

enum EnvKind {
	Linux = 'linux',
	Windows = 'windows'
}

const linuxTestPath = '/some/directory/path'
const windowsTestPath = 'C:\\some\\directory\\path'

export default class FileFieldTest extends BaseTest {
	private static fileDefinition = buildSchemaDefinition({
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

	@test(
		'Can create schema and properly parse path set path',
		EnvKind.Linux,
		linuxTestPath,
		{
			path: linuxTestPath,
			ext: '.ts',
			type: 'application/typescript',
			name: 'test.ts'
		}
	)
	@test(
		'Can create schema and properly parse path set path by name',
		EnvKind.Linux,
		linuxTestPath,
		{
			name: `${linuxTestPath}/test.ts`
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
			name: 'test.ts'
		}
	)
	@test(
		'Can create schema and properly parse path set path by name in windows',
		EnvKind.Windows,
		windowsTestPath,
		{
			name: `${windowsTestPath}\\test.ts`
		}
	)
	@test(
		'Can create schema and properly parse path set as string in windows',
		EnvKind.Windows,
		windowsTestPath,
		`${windowsTestPath}/test.ts`
	)
	public static testInSchema(
		_spruce: Spruce,
		env: EnvKind,
		expectedPath: string,
		setTarget: IFileFieldValue
	) {
		if (env === EnvKind.Linux) {
			// @ts-ignore
			path.sep = '/'
		} else if (env === EnvKind.Windows) {
			// @ts-ignore
			path.sep = '\\'
		}
		const schema = new Schema(this.fileDefinition)

		schema.set('target', setTarget)

		const values = schema.getValues({
			fields: ['target']
		})

		assert.isOk(values.target)
		assert.equal(values.target.path, expectedPath)
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
		_spruce: Spruce,
		path: string,
		relativeTo: string,
		expectedPath: string
	) {
		const schema = new Schema(this.fileDefinition)
		schema.set('target', { path, name: 'app.ts' })
		const target = schema.get('target', { byField: { target: { relativeTo } } })
		assert.equal(target.path, expectedPath)
	}
}
