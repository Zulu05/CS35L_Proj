// External Dependencies
import { expect, test } from 'vitest'

// Internal Dependencies
import {validatePassword, validateUsername, validateEmail} from "../services/regex.service"

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
    expect(validateUsername('a cb 33 3')).toBe(false) // Alternating whitespace
    expect(validateUsername('Vítor')).toBe(false) // non ascii
    expect(validateUsername('用户')).toBe(false) // non ascii 
    expect(validateUsername('Dürschmid')).toBe(false) // non ascii

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
    expect(validateEmail('')).toBe(false) // no characters
    expect(validateEmail('     ')).toBe(false) // all whitespace
    expect(validateEmail('a@g')).toBe(false) // not enough chars throughout
    expect(validateEmail('@gmail.com')).toBe(false) // not enough chars to start
    expect(validateUsername('a@g.c')).toBe(false) // not enough chars throughout
    expect(validateEmail('aaa  @gmail.com')).toBe(false) // whitespace in middle
    expect(validateEmail('   aaa@gmail.com')).toBe(false) // starting whitespace
    expect(validateEmail('aa@gmail.com   ')).toBe(false) // ending with whitespace
    expect(validateEmail('aaa@gm   ail.com')).toBe(false) // middle whitespace in domain
    expect(validateEmail('aaa@gmail.co   m')).toBe(false) // whitespace in domain
    expect(validateEmail('**@gmail.com')).toBe(false) // invalid chars
    expect(validateEmail('aaaa@g.c')).toBe(false) // invalid domain
    expect(validateEmail('testing----@gmail.com')).toBe(false) // ending with dashes
    expect(validateEmail('Dürschmid@g.ucla.edu')).toBe(false) // non ascii in email name

    //passing tests
    expect(validateEmail('aaa@gmail.com')).toBe(true) // all alphabet
    expect(validateEmail('AAAAA@gmail.com')).toBe(true) // capitalized
    expect(validateEmail('123@gmail.com')).toBe(true) //numbers
    expect(validateEmail('1234aaaAAA@gmail.com')).toBe(true) // mixed, start with number
    expect(validateEmail('aaa1123AAA@gmail.com')).toBe(true) // mixed start with lowercase
    expect(validateEmail('AAAA123aaa@gmail.com')).toBe(true) // mixed start with capital
    expect(validateEmail('aaAAAaa123@gmail.com')).toBe(true) // mixed, end with number
    expect(validateEmail('aaa-aa123@gmail.com')).toBe(true) // testing with dashes
    expect(validateEmail('aaa.aa123@gmail.com')).toBe(true) // test with periods
    expect(validateEmail('aa....123@gmail.com')).toBe(true) // multiple periods
    expect(validateEmail('aa----123@gmail.com')).toBe(true) // multiple dashes
    expect(validateEmail('aaa@g.ucla.edu')).toBe(true) // different domain
    expect(validateEmail('123aaa@g.ucla.edu')).toBe(true) // numbers start with different domain
    expect(validateEmail('testing----aaa@gmail.com')).toBe(true) // multiple dashes with only alphabet
    expect(validateEmail('john_doe@gmail.com')).toBe(true) // underscores
    expect(validateEmail('john+newsletter@gmail.com')).toBe(true) // plus aliases
    expect(validateEmail('user@domain.technologies')).toBe(true) // long TLDs
    expect(validateEmail('user@yahoo.com.br')).toBe(true) //multiple domain parts
    expect(validateEmail('user@yahoo.com.de')).toBe(true) // try different countries
    expect(validateEmail('user@domain.technologies.br.de.fr')).toBe(true) // multiple .
    expect(validateEmail('user@g.ucla.edu')).toBe(true) // short domain is supported

})
