import { type } from 'arktype';
import { describe, expect, it } from 'vitest';
import { formDataToObject, validateFormData } from './formData.js';

describe('formDataToObject', () => {
  it('Should parse empty formData object', () => {
    const obj = formDataToObject(new FormData());
    expect(Object.keys(obj).length).toBe(0);
  });

  it('Should work on basic string data', () => {
    const fd = new FormData();
    fd.append('name', 'bob');
    fd.append('surname', 'surbob');
    const obj = formDataToObject(fd);
    expect(obj).toStrictEqual({ name: 'bob', surname: 'surbob' });
  });

  it('Should work for mixed types', () => {
    const fd = new FormData();
    fd.append('name', 'bob');
    fd.append('surname', 'surbob');
    fd.append('age', '52');
    const obj = formDataToObject(fd);
    expect(obj).toStrictEqual({ name: 'bob', surname: 'surbob', age: 52 });

    fd.append('universe', 'true');
    const obj2 = formDataToObject(fd);
    expect(obj2).toHaveProperty('universe');
    expect(obj2.universe).toBeTruthy();

    fd.append('parents', 'false');

    const obj3 = formDataToObject(fd);
    expect(obj3).toHaveProperty('parents');
    expect(obj3.parents).toBeFalsy();

    fd.append('explicitNotation', '103n');

    const obj4 = formDataToObject(fd);
    expect(obj4.explicitNotation).toStrictEqual(103n);

    fd.append('implicitBig', '9007199254740992');
    const obj5 = formDataToObject(fd);
    expect(obj5.implicitBig).toStrictEqual(9007199254740992n);

    expect(obj5).toStrictEqual({
      name: 'bob',
      surname: 'surbob',
      age: 52,
      universe: true,
      parents: false,
      explicitNotation: 103n,
      implicitBig: 9007199254740992n,
    });
  });

  it('Should work with the filter function', () => {
    const fd = new FormData();
    fd.append('name', 'bob');
    fd.append('notAllowed', 'secret informations');
    fd.append('surname', 'surbob');

    const obj = formDataToObject(fd, ([key]) => key !== 'notAllowed');
    expect(obj).toStrictEqual({ name: 'bob', surname: 'surbob' });
  });

  it('Should work with repeated items', () => {
    const fd = new FormData();
    fd.append('names', 'bob');
    fd.append('names', 'jerome');
    fd.append('names', 'phteven');
    expect(formDataToObject(fd)).toStrictEqual({
      names: ['bob', 'jerome', 'phteven'],
    });
  });

  it('Should force array for keys that end in []', () => {
    const fd = new FormData();
    fd.append('names[]', 'bob');
    fd.append('ages[]', '13');
    fd.append('title', 'Fantastic Voyage');

    expect(formDataToObject(fd)).toStrictEqual({
      names: ['bob'],
      ages: [13],
      title: 'Fantastic Voyage',
    });
  });

  it('Should work with specified keys in arrays', () => {
    const fd = new FormData();
    fd.append('names[0]', 'bob');
    fd.append('names[2]', 'joe');
    fd.append('names[1]', 'rob');
    expect(formDataToObject(fd)).toStrictEqual({
      names: ['bob', 'rob', 'joe'],
    });
  });

  it('Should work with objects', () => {
    const fd = new FormData();
    fd.append('locations[london]', '24');
    fd.append('locations[new_york]', '77');

    expect(formDataToObject(fd)).toStrictEqual({
      locations: {
        london: 24,
        new_york: 77,
      },
    });
  });

  it('Should work with File objects', () => {
    const fd = new FormData();
    fd.set('file', new File([], 'testing.txt'));

    const obj = formDataToObject(fd);
    expect(obj.file).toBeInstanceOf(File);
  });
});

describe('validateFormData', () => {
  const fileType = type(['instanceof', File]);
  it('Validates simple object', () => {
    const schema = type({
      name: 'string',
      surname: 'string',
    });
    const fd = new FormData();
    fd.append('name', 'bob');
    fd.append('surname', 'surbob');

    const obj = validateFormData(fd, schema);

    expect(obj).toStrictEqual({ name: 'bob', surname: 'surbob' });

    const wontPassSchema = type({
      name: 'number',
      surname: 'Set',
    });

    expect(() => validateFormData(fd, wontPassSchema)).toThrow();
  });

  it('Validates a more complex schema', () => {
    const f = new File([], 'file.txt');
    const fd = new FormData();
    fd.append('emails', 'jim@jim.jim');
    fd.append('emails', 'bob@bob.email');
    fd.append('something', 'true');
    fd.append('something-else', '101n');
    fd.append('file-upload', f);

    const passSchema = type({
      emails: 'string.email[]',
      something: 'boolean',
      'something-else': 'bigint',
      'file-upload': fileType,
    });

    const obj = validateFormData(fd, passSchema);

    expect(obj).toStrictEqual({
      emails: ['jim@jim.jim', 'bob@bob.email'],
      something: true,
      'something-else': 101n,
      'file-upload': f,
    });

    fd.append('emails', 'bad@');

    expect(() => validateFormData(fd, passSchema)).toThrow();
  });
});
