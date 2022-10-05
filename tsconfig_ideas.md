# useDefineForClassFields

With this set to `true`, I'll get the upcoming new behavior.

## Fields that aren't pre-initialized

### Old behavior

```
class C {
  foo = 100;
  bar: string;
}
```

Only defined fields are included in the Javascript. So it transpiles to this:

```
class C {
  constructor() {
    this.foo = 100;
  }
}
```

### New behavior

```
class C {
  foo = 100;
  bar: string;
}
```

All fields are defined in the JavaScript. Any that are undefined in the Typescript are initialized to undefined. It
transpiles to this:

```
class C {
  constructor() {
    Object.defineProperty(this, "foo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 100,
    });
    Object.defineProperty(this, "bar", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
  }
}
```


