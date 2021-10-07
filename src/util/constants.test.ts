import test from 'ava';
import {API_URL, USER_AGENT, UUID_V4_REG_EXP} from './constants';

test('API URL', t => {
	t.notThrows(() => new URL(API_URL), 'API URL is a proper URL');
});

test('UUID v4 RegExp', t => {
	t.regex('04e00bae-f53d-429a-99c1-69de54d16d91', UUID_V4_REG_EXP);
	t.notRegex('not a UUID', UUID_V4_REG_EXP);
});

test('User agent', t => {
	t.regex(USER_AGENT, /Scambio v(?<digit>\d\.){2}\d/);
});
