type Something = {
  a: string;
  b: number;
  c: {
    abc: string;
    def: number;
  };
};

type GetDotNotation<T> = {
  [K in keyof T as `!${K}`]: T[K];
};

type FancyThing<T> = {
  [key: string]: keyof GetDotNotation<T>;
};

let f: FancyThing<Something> = {
  djkfdjklfjdlfaj: '!b',
  fjfkdjfkdj: '!',
};
