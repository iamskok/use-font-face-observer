import { renderHook } from "@testing-library/react-hooks"
import FontFaceObserver from "fontfaceobserver"
import { mocked } from "ts-jest/utils"
import useFontFaceObserver from "../index"

jest.mock(`fontfaceobserver`)

const MockedFontFaceObserverModule = mocked(FontFaceObserver, true).prototype

test(`Hook returns \`true\` when no \`FontFace\`s were passed`, async () => {
  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces),
    {
      initialProps: {
        fontFaces: [],
      },
    }
  )

  await waitForNextUpdate()

  expect(result.current).toBe(true)
})

test(`Hook returns \`true\` when 1 \`FontFace\` was passed and resolved`, async () => {
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve())

  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces),
    {
      initialProps: {
        fontFaces: [
          {
            family: `Amstelvar`,
          },
        ],
      },
    }
  )

  await waitForNextUpdate()

  expect(result.current).toBe(true)
})

test(`Hook returns \`true\` when multiple \`FontFace\`s were passed and resolved`, async () => {
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve())

  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces),
    {
      initialProps: {
        fontFaces: [
          {
            family: `Amstelvar`,
          },
          {
            family: `Inter`,
          },
        ],
      },
    }
  )

  await waitForNextUpdate()

  expect(result.current).toBe(true)
})

test(`Hook returns \`false\` when multiple \`FontFace\`s were passed and rejected`, async () => {
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.reject())

  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces, { timeout: 100 }),
    {
      initialProps: {
        fontFaces: [
          {
            family: `Amstelvar`,
          },
          {
            family: `Inter`,
          },
        ],
      },
    }
  )

  let flag = false

  try {
    await waitForNextUpdate()
  } catch (error) {
    if (error.message.toLowerCase().includes(`timed out`)) {
      flag = true
    }
  }

  expect(flag).toBe(true)
  expect(result.current).toBe(false)
})
