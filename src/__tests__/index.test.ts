import { greet } from '../index'

test('greet', () => {
  expect(greet('John')).toEqual('Hello, John')
})
