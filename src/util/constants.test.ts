import test from 'ava';
import {UUID_V4_REG_EXP, API_URL, TOKEN_REG_EXP, USER_AGENT} from './constants';

test('Token RegExp', t => {
	t.regex('bc505e5d436b2b7f417cc6d3c617c00471d3695e13d85fec5b2ade2c9f66fad0', TOKEN_REG_EXP);
	t.notRegex('not a SHA-256 digest', TOKEN_REG_EXP);
});

test('API URL', t => {
	return t.notThrows(() => new URL(API_URL), 'API URL is a proper URL');
});

test('UUID v4 RegExp', t => {
	t.regex('04e00bae-f53d-429a-99c1-69de54d16d91', UUID_V4_REG_EXP);
	t.notRegex('not a UUID', UUID_V4_REG_EXP);
});

test('User agent', t => {
	t.regex(USER_AGENT, /Scambio v(?<digit>\d\.){2}\d/);
});
