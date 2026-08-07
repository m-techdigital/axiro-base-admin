import fs from 'node:fs'

const source = fs.readFileSync(
    'src/components/base/BaseFormControl.jsx',
    'utf8',
)

const required = [
    '...injectedControlProps',
    '...(field.props || {})',
    '...injectedControlProps,',
    '...controlProps',
    'cloneElement(field.component, controlProps)',
]

for (const token of required) {
    if (!source.includes(token)) {
        throw new Error(
            `BaseFormControl controlled bridge is missing: ${token}`,
        )
    }
}

if (
    /function BaseFormControl\(\{\s*field,\s*context\s*=\s*\{\}\s*\}\)/s.test(
        source,
    )
) {
    throw new Error(
        'BaseFormControl must not discard Form.Item injected value/onChange props.',
    )
}

console.log('BaseFormControl controlled bridge: PASS')
