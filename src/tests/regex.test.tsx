import {validatePassword, validateUsername, validateEmail} from "../services/regex.service"
import { expect, test } from 'vitest'

test ("validatePassword", () => {
    //failing tests
    expect(validatePassword('a')).toBe(false) // one character
    expect(validatePassword('')).toBe(false) // nothing
    expect(validatePassword('abcedfpassword')).toBe(false) // all lowercase
    expect(validatePassword('abcedfpassword!')).toBe(false) // no uppercase or numbers
    expect(validatePassword('1abcedfpassword!')).toBe(false) // no uppercase
    expect(validatePassword('!abcedfpassword1')).toBe(false) // no uppercase
    expect(validatePassword('abcedfpassword1')).toBe(false) // no uppercase or special chars
    expect(validatePassword('!aA1')).toBe(false) // too short
    expect(validatePassword('123!!!a')).toBe(false) // too short
    expect(validatePassword('123!!!a!')).toBe(false) // no upper case
    expect(validatePassword('123Aa!')).toBe(false) // too short
    expect(validatePassword('AAAAA')).toBe(false) // all upper case, too short
    expect(validatePassword('          ')).toBe(false) // all whitespace
    expect(validatePassword('AAAAAAasbakdfasfs')).toBe(false) // all alphabetical chars
    expect(validatePassword('AAAA123123123123!   ')).toBe(false) // ends with whitespaces
    expect(validatePassword('PASSWORD!')).toBe(false) // all uppercase
    expect(validatePassword('      !abcedfpassword1')).toBe(false) // starts with whitespace
    expect(validatePassword('Password123!    ')).toBe(false) // ends with whitespace but valid
    expect(validatePassword('!a       A1')).toBe(false) // whitespace in middle
    expect(validatePassword('123      !!!Aa')).toBe(false) // whitespace in middle but valid otherwise
    expect(validatePassword('___++++!!!a!')).toBe(false) // not valid chars to start
    expect(validatePassword('123+++++Aa!')).toBe(false) // not valid chars in middle
    expect(validatePassword('123Aacancelled++++')).toBe(false) // not valid chars in end

    //passing tests
    expect(validatePassword('123Aaaaaaa!')).toBe(true) // start with number
    expect(validatePassword('A123aaaaaa!')).toBe(true) // start with uppercase
    expect(validatePassword('!123Aaaaaaa')).toBe(true) // start with special char
    expect(validatePassword('a123Aaaaaaa!')).toBe(true) // start with lowercase
    expect(validatePassword('123Aaaaaaa!a')).toBe(true) // change order, end with lowercase
    expect(validatePassword('Aaaaaaa!1')).toBe(true) // change order, end with digit
    expect(validatePassword('123aaaaaa!B')).toBe(true) // end with uppercase
    expect(validatePassword('ValidPassword123!')).toBe(true) // end with special char
    expect(validatePassword('!!!VALID!yes123')).toBe(true) // adding multiple special chars in start and middle
    expect(validatePassword('doesthiswork?123A')).toBe(true) // changing order
    expect(validatePassword('123456!Aa123456')).toBe(true) // start and end with digit
    expect(validatePassword('????aAa123')).toBe(true) // test different special char
    expect(validatePassword('checkcheckCHECKcheckcheckcheckCHECKcheckcheckcheckCHECKcheck!1')).toBe(true) // test multiple repeats with special char and digit at end
    expect(validatePassword('aaaaa!111@$!%*?&B')).toBe(true) // testing all special chars
    expect(validatePassword('VALID$yes123')).toBe(true) // testing $ 
    expect(validatePassword('doesthiswork%123A')).toBe(true) // testing %
    expect(validatePassword('123456&Aa123456')).toBe(true) // testing &
    expect(validatePassword('****aAa123')).toBe(true) // testing *
})

test ("validateUsername", () => {
    //failing tests
    expect(validateUsername('')).toBe(false) // testing nothing
    expect(validateUsername('a')).toBe(false) // too short
    expect(validateUsername('ab')).toBe(false) // too short
    expect(validateUsername('a2')).toBe(false) // too short
    expect(validateUsername('4b')).toBe(false) // too short
    expect(validateUsername('ab!')).toBe(false) // special chars not allowed
    expect(validateUsername('*&*')).toBe(false) // special chars
    expect(validateUsername('     ')).toBe(false) // no whitespace
    expect(validateUsername('   abc')).toBe(false) // start whitespace
    expect(validateUsername('a    bc')).toBe(false) // middle whitespace
    expect(validateUsername('abc     ')).toBe(false) // end whitespace
    expect(validateUsername('a?4_abcb')).toBe(false) // more special chars mixed into valid
    expect(validateUsername('    acb333')).toBe(false) // whitespace start with valid
    expect(validateUsername('acb     333')).toBe(false) // whitespace middle with valid 
    expect(validateUsername('acb333    ')).toBe(false) // whitespace end with valid 
    expect(validateUsername('acb33 3')).toBe(false) // only one whitespace

    //passing tests
    expect(validateUsername('abc')).toBe(true) // all alphabet
    expect(validateUsername('ab1')).toBe(true) // mix, less number
    expect(validateUsername('a23')).toBe(true) // mix, more number
    expect(validateUsername('1231ab')).toBe(true) // mix
    expect(validateUsername('1231231')).toBe(true) // all number
    expect(validateUsername('adfasjfklasjflkasjfa111lslfadjla')).toBe(true) // number in middle
    expect(validateUsername('aacb11111111')).toBe(true) // valid with number in end
    expect(validateUsername('23aaaaaafdsa')).toBe(true) // valid with number starting
    expect(validateUsername('1a2a3a1a1b')).toBe(true) // alternating numbers
    expect(validateUsername('123')).toBe(true) // all numbers at minimum
})

test ("validateEmail", () => {
    //failing tests
    expect(validateUsername('')).toBe(false)
})
