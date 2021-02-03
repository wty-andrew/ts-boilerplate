import '../index'

test('render without crashing', () => {
  expect(document.body).toMatchSnapshot()
})
