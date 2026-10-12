/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: async key => (store.has(key) ? store.get(key) : null),
      setItem: async (key, value) => {
        store.set(key, value);
      },
      removeItem: async key => {
        store.delete(key);
      },
      clear: async () => {
        store.clear();
      },
    },
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(() => Promise.resolve('')),
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Icon = props => React.createElement(View, props);
  return new Proxy(
    {__esModule: true},
    {
      get: (target, prop) => (prop in target ? target[prop] : Icon),
    },
  );
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Mock = props => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: Mock,
    Svg: Mock,
    Circle: Mock,
    Path: Mock,
    G: Mock,
    Rect: Mock,
  };
});
