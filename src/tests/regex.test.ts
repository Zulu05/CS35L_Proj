import {validatePassword, validateUsername, validateEmail} from "../services/regex.service"
import { expect, test } from 'vitest'

test ("validatePassword", () => {
    //failing tests
    expect(validatePassword('a')).toBe(false)
    expect(validatePassword('')).toBe(false)
    expect(validatePassword('abcedfpassword')).toBe(false)
    expect(validatePassword('abcedfpassword!')).toBe(false)
    expect(validatePassword('1abcedfpassword!')).toBe(false)
    expect(validatePassword('!abcedfpassword1')).toBe(false)
    expect(validatePassword('abcedfpassword1')).toBe(false)
    expect(validatePassword('!aA1')).toBe(false)
    expect(validatePassword('123!!!a')).toBe(false)
    expect(validatePassword('123!!!a!')).toBe(false)
    expect(validatePassword('123Aa!')).toBe(false)

    //passing tests
    expect(validatePassword('123Aaaaaaa!')).toBe(true)
    expect(validatePassword('A123aaaaaa!')).toBe(true)
    expect(validatePassword('!123Aaaaaaa')).toBe(true)
    expect(validatePassword('a123Aaaaaaa!')).toBe(true)
    expect(validatePassword('123Aaaaaaa!a')).toBe(true)
    expect(validatePassword('Aaaaaaa!1')).toBe(true)
    expect(validatePassword('123aaaaaa!B')).toBe(true)
})

test ("validateUsername", () => {
    //failing tests
    expect(validateUsername('')).toBe(false)
    expect(validateUsername('a')).toBe(false)
    expect(validateUsername('ab')).toBe(false)
    expect(validateUsername('a2')).toBe(false)
    expect(validateUsername('4b')).toBe(false)
    expect(validateUsername('ab!')).toBe(false)
    expect(validateUsername('*&*')).toBe(false)

    //passing tests
    expect(validateUsername('abc')).toBe(true)
    expect(validateUsername('ab1')).toBe(true)
    expect(validateUsername('a23')).toBe(true)
    expect(validateUsername('1231ab')).toBe(true)
    expect(validateUsername('1231231')).toBe(true)
})

test ("validateEmail", () => {
    //failing tests
    expect(validateUsername('')).toBe(false)
})
