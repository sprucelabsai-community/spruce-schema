# [1.24.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.23.0...v1.24.0) (2020-05-04)


### Features

* pick field names by type uses union which wors vs IFieldDefinition (which everything extends so wtf?) ([41035a2](https://github.com/sprucelabsai/spruce-schema/commit/41035a2))

# [1.23.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.22.0...v1.23.0) (2020-05-04)


### Features

* definition choices to hash update ([b4ab9fa](https://github.com/sprucelabsai/spruce-schema/commit/b4ab9fa))

# [1.22.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.21.0...v1.22.0) (2020-05-03)


### Features

* name changes ([577b6c2](https://github.com/sprucelabsai/spruce-schema/commit/577b6c2))

# [1.21.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.20.0...v1.21.0) (2020-05-03)


### Features

* hashing name change ([807f716](https://github.com/sprucelabsai/spruce-schema/commit/807f716))

# [1.20.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.19.0...v1.20.0) (2020-05-02)


### Features

* path fixes and select test additions ([620d941](https://github.com/sprucelabsai/spruce-schema/commit/620d941))

# [1.19.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.18.0...v1.19.0) (2020-05-02)


### Features

* enhanced select hash mapping ([230f89c](https://github.com/sprucelabsai/spruce-schema/commit/230f89c))

# [1.18.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.17.0...v1.18.0) (2020-05-01)


### Features

* hash fix ([6769271](https://github.com/sprucelabsai/spruce-schema/commit/6769271))

# [1.17.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.16.0...v1.17.0) (2020-05-01)


### Features

* select options to hash ([3fba090](https://github.com/sprucelabsai/spruce-schema/commit/3fba090))

# [1.16.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.15.0...v1.16.0) (2020-05-01)


### Features

* isDefinitionValid now types ([e7951fd](https://github.com/sprucelabsai/spruce-schema/commit/e7951fd))

# [1.15.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.14.1...v1.15.0) (2020-04-30)


### Features

* optional utility type (like partial with null) ([987a381](https://github.com/sprucelabsai/spruce-schema/commit/987a381))

## [1.14.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.14.0...v1.14.1) (2020-04-30)


### Bug Fixes

* is not required is null also ([73edb0e](https://github.com/sprucelabsai/spruce-schema/commit/73edb0e))
* null fix ([27f4de2](https://github.com/sprucelabsai/spruce-schema/commit/27f4de2))
* null fixes ([998764c](https://github.com/sprucelabsai/spruce-schema/commit/998764c))

# [1.14.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.13.0...v1.14.0) (2020-04-30)


### Features

* fixed definition type value generation ([9ed8aa3](https://github.com/sprucelabsai/spruce-schema/commit/9ed8aa3))

# [1.13.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.12.0...v1.13.0) (2020-04-29)


### Features

* schema field maps many schemas to discriminating union ([9f3629a](https://github.com/sprucelabsai/spruce-schema/commit/9f3629a))
* schema union field now a generic ([c751299](https://github.com/sprucelabsai/spruce-schema/commit/c751299))
* template generation tests passing ([e7842ee](https://github.com/sprucelabsai/spruce-schema/commit/e7842ee))
* value type fix and additional default values type test ([b6e3873](https://github.com/sprucelabsai/spruce-schema/commit/b6e3873))

# [1.12.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.11.0...v1.12.0) (2020-04-28)


### Features

* nonnoullable ([d1312d8](https://github.com/sprucelabsai/spruce-schema/commit/d1312d8))

# [1.11.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.10.0...v1.11.0) (2020-04-28)


### Features

* date (without time) field ([5a0ae46](https://github.com/sprucelabsai/spruce-schema/commit/5a0ae46))

# [1.10.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.9.0...v1.10.0) (2020-04-28)


### Features

* wrap raw field value type in parens ([f39d57d](https://github.com/sprucelabsai/spruce-schema/commit/f39d57d))

# [1.9.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.8.1...v1.9.0) (2020-04-27)


### Features

* raw field now passes through value type from options ([a4b13ec](https://github.com/sprucelabsai/spruce-schema/commit/a4b13ec))

## [1.8.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.8.0...v1.8.1) (2020-04-27)

# [1.8.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.7.0...v1.8.0) (2020-04-27)


### Features

* field map lazy loading to remove circular dependencies ([8d13325](https://github.com/sprucelabsai/spruce-schema/commit/8d13325))

# [1.7.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.6.0...v1.7.0) (2020-04-26)


### Features

* moved types out of class files ([a7b86b3](https://github.com/sprucelabsai/spruce-schema/commit/a7b86b3))
* schema types moved to new file to stop circular dependencies ([230f40d](https://github.com/sprucelabsai/spruce-schema/commit/230f40d))

# [1.6.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.5.2...v1.6.0) (2020-04-24)


### Features

* schema tests ([3bb6bec](https://github.com/sprucelabsai/spruce-schema/commit/3bb6bec))

## [1.5.2](https://github.com/sprucelabsai/spruce-schema/compare/v1.5.1...v1.5.2) (2020-04-23)


### Bug Fixes

* remove uneeded definition from fieldtemplate item ([f5705db](https://github.com/sprucelabsai/spruce-schema/commit/f5705db))

## [1.5.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.5.0...v1.5.1) (2020-04-23)


### Bug Fixes

* fix imports on tests ([cdcef63](https://github.com/sprucelabsai/spruce-schema/commit/cdcef63))
* remvoed unneeded buildSchemaDefinition ([fc7d193](https://github.com/sprucelabsai/spruce-schema/commit/fc7d193))
* schema validate ([743cc68](https://github.com/sprucelabsai/spruce-schema/commit/743cc68))

# [1.5.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.4.0...v1.5.0) (2020-04-23)


### Features

* field registeration improvements ([fb26b00](https://github.com/sprucelabsai/spruce-schema/commit/fb26b00))

# [1.4.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.5...v1.4.0) (2020-04-23)


### Features

* swap out test library and use jest ([b314329](https://github.com/sprucelabsai/spruce-schema/commit/b314329))

## [1.3.5](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.4...v1.3.5) (2020-04-21)


### Refactoring

* newer, better templating ([d930550](https://github.com/sprucelabsai/spruce-schema/commit/d930550))

## [1.3.4](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.3...v1.3.4) (2020-04-21)


### Bug Fixes

* non-narrowing buildSchemaDefinition for better typeing in input ([9b40c37](https://github.com/sprucelabsai/spruce-schema/commit/9b40c37))

## [1.3.3](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.2...v1.3.3) (2020-04-21)


### Bug Fixes

* moved FieldtemlateDetails to seperate file to break circular dependency ([1ae2923](https://github.com/sprucelabsai/spruce-schema/commit/1ae2923))

## [1.3.2](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.1...v1.3.2) (2020-04-20)


### Refactoring

* lint updates based on abstract field changes ([6fb4943](https://github.com/sprucelabsai/spruce-schema/commit/6fb4943))

## [1.3.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.3.0...v1.3.1) (2020-04-20)


### Bug Fixes

* path alias updated to support build directory ([2d3f21b](https://github.com/sprucelabsai/spruce-schema/commit/2d3f21b))

# [1.3.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.2.4...v1.3.0) (2020-04-19)


### Features

* schema unions have schemaId and values to help resolve ([3942b01](https://github.com/sprucelabsai/spruce-schema/commit/3942b01))

## [1.2.4](https://github.com/sprucelabsai/spruce-schema/compare/v1.2.3...v1.2.4) (2020-04-19)


### Bug Fixes

* test renamed from default ([33dfbb0](https://github.com/sprucelabsai/spruce-schema/commit/33dfbb0))

## [1.2.3](https://github.com/sprucelabsai/spruce-schema/compare/v1.2.2...v1.2.3) (2020-04-19)


### Bug Fixes

* test name changed from placeholder ([fbd5ad8](https://github.com/sprucelabsai/spruce-schema/commit/fbd5ad8))

## [1.2.2](https://github.com/sprucelabsai/spruce-schema/compare/v1.2.1...v1.2.2) (2020-04-19)


### Bug Fixes

* comment spelling fixes ([56d0dc6](https://github.com/sprucelabsai/spruce-schema/commit/56d0dc6))

## [1.2.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.2.0...v1.2.1) (2020-04-19)

# [1.2.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.1.1...v1.2.0) (2020-04-19)


### Features

* build schema now narrows ([a4ca4e7](https://github.com/sprucelabsai/spruce-schema/commit/a4ca4e7))

## [1.1.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.1.0...v1.1.1) (2020-04-17)

# [1.1.0](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.21...v1.1.0) (2020-04-16)


### Features

* buildSelectOptions for union generation ([8ba0e90](https://github.com/sprucelabsai/spruce-schema/commit/8ba0e90))

## [1.0.21](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.20...v1.0.21) (2020-04-16)

## [1.0.20](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.19...v1.0.20) (2020-04-16)

## [1.0.19](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.18...v1.0.19) (2020-04-16)

## [1.0.18](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.17...v1.0.18) (2020-04-16)

## [1.0.17](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.16...v1.0.17) (2020-04-16)

## [1.0.16](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.15...v1.0.16) (2020-04-16)

## [1.0.15](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.14...v1.0.15) (2020-04-16)

## [1.0.14](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.13...v1.0.14) (2020-04-16)

## [1.0.13](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.12...v1.0.13) (2020-04-14)

## [1.0.12](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.11...v1.0.12) (2020-04-14)

## [1.0.11](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.10...v1.0.11) (2020-04-13)

## [1.0.10](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.9...v1.0.10) (2020-04-12)

## [1.0.9](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.8...v1.0.9) (2020-04-11)

## [1.0.8](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.7...v1.0.8) (2020-04-10)

## [1.0.7](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.6...v1.0.7) (2020-04-08)

## [1.0.6](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.5...v1.0.6) (2020-04-06)

## [1.0.5](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.4...v1.0.5) (2020-04-06)

## [1.0.4](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.3...v1.0.4) (2020-04-06)

## [1.0.3](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.2...v1.0.3) (2020-04-03)


### Bug Fixes

* set default editorconfig for consistency ([4408a67](https://github.com/sprucelabsai/spruce-schema/commit/4408a67))

## [1.0.2](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.1...v1.0.2) (2020-04-03)

## [1.0.1](https://github.com/sprucelabsai/spruce-schema/compare/v1.0.0...v1.0.1) (2020-04-03)

# 1.0.0 (2020-04-03)


### Bug Fixes

* vscode eslint not validating ([a727655](https://github.com/sprucelabsai/spruce-schema/commit/a727655))
