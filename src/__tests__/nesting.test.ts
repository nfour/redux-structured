
const structure = {
  get actions() {

  },
};

type IInput = () => void | { [key: string]: IInput };

const nestify = (input: IInput) => {
  // TODO: should iterate, producing a clone of the structure with getters
  // and to also pass down immutable context
};

describe('nesting', () => {
  it('wee', () => {

  });
});
