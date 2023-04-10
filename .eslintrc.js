module.exports = {
	root: true,
	env: {
		browser: true,
		node: false,
		jest: true
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:import/typescript',
		'prettier',
		'plugin:jest/recommended',
		'plugin:jest/style',
		'plugin:no-unsanitized/DOM'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json', './config/tsconfig.eslint.json']
	},
	plugins: ['@typescript-eslint', 'import', 'jest', 'no-unsanitized'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts']
			}
		}
	},
	ignorePatterns: ['azuremediaplayer.d.ts'],
	rules: {
		'no-alert': 'error',
		'jest/no-disabled-tests': 'off',
		'no-process-env': 'error',
		// TODO this one is a pain to fix w/ ProseMirror's Class<T extends Schema = any> types
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/consistent-type-assertions': 'off',
		'@typescript-eslint/indent': ['off', 'tabs'],
		'@typescript-eslint/interface-name-prefix': 'error',
		'@typescript-eslint/member-ordering': 'error',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-use-before-define': [
			'error',
			{
				functions: false,
				classes: true,
				enums: true,
				variables: true,
				typedefs: true
			}
		],
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-for-of': 'off',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
		'@typescript-eslint/prefer-includes': 'off',
		'@typescript-eslint/quotes': [
			'error',
			'single',
			{ allowTemplateLiterals: true, avoidEscape: true }
		],
		'@typescript-eslint/triple-slash-reference': 'error',
		'@typescript-eslint/unified-signatures': 'error',
		'arrow-parens': ['error', 'as-needed'],
		camelcase: 'off',
		'comma-dangle': 'error',
		complexity: 'off',
		'constructor-super': 'error',
		'dot-notation': 'error',
		eqeqeq: ['error', 'smart'],
		'guard-for-in': 'off',
		'id-blacklist': 'off',
		'id-match': 'off',
		'import/order': 'off',
		'max-classes-per-file': 'off',
		'max-len': 'off',
		'new-parens': 'error',
		'no-bitwise': 'off',
		'no-caller': 'error',
		'no-console': 'error',
		'no-debugger': 'error',
		'no-eval': 'error',
		'no-new-wrappers': 'error',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-undef-init': 'error',
		'no-unsafe-finally': 'error',
		'no-unused-expressions': 'error',
		'no-unused-labels': 'error',
		'no-var': 'error',
		'no-unsanitized/property': 'error',
		'object-shorthand': 'error',
		'one-var': ['error', 'never'],
		'prefer-arrow/prefer-arrow-functions': 'off',
		'prefer-const': [
			'error',
			{
				destructuring: 'all'
			}
		],
		'quote-props': ['error', 'as-needed'],
		radix: 'off',
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'spaced-comment': ['off', 'never'],
		'use-isnan': 'error',
		'valid-typeof': 'off',
		'@typescript-eslint/unbound-method': 'off',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false
				}
			}
		],
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/prefer-string-starts-ends-with': 'off',
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'no-unused-expressions': 'off',
		'no-throw-literal': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'import/no-unresolved': [2, { ignore: ['bundle-text'] }],
		'import/no-cycle': [2, { maxDepth: 10 }],
		semi: ['error', 'always'],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'error',
		'@typescript-eslint/no-unsafe-member-access': 'error',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-unsafe-call': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unsafe-return': 'error',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/restrict-template-expressions': 'error',
		'@typescript-eslint/restrict-plus-operands': 'error',
		'@typescript-eslint/ban-types': 'error',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'default',
				format: ['camelCase']
			},
			{
				selector: 'variable',
				format: ['camelCase', 'UPPER_CASE']
			},
			{
				selector: 'parameter',
				format: ['camelCase'],
				leadingUnderscore: 'allow'
			},
			{
				selector: 'memberLike',
				modifiers: ['private'],
				format: ['camelCase'],
				leadingUnderscore: 'allow'
			},
			{
				selector: 'typeLike',
				format: ['PascalCase']
			},
			{
				selector: 'property',
				format: null // does not check property names (ie HTTP headers)
			}
		]
	}
};
