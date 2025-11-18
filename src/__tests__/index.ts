import { renderHook } from "@testing-library/react-hooks"
import FontFaceObserver from "fontfaceobserver"
import { mocked } from "ts-jest/utils"
import useFontFaceObserver from "../index"

jest.mock(`fontfaceobserver`)

const MockedFontFaceObserverModule = mocked(FontFaceObserver, true).prototype

test(`Hook returns resolved state when no \`FontFace\`s were passed`, async () => {
  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces),
    {
      initialProps: {
        fontFaces: [],
      },
    }
  )

  await waitForNextUpdate()

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(true)
  expect(result.current.error).toBe(null)
})

test(`Hook returns resolved state when 1 \`FontFace\` was passed and resolved`, async () => {
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

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(true)
  expect(result.current.error).toBe(null)
})

test(`Hook returns resolved state when multiple \`FontFace\`s were passed and resolved`, async () => {
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

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(true)
  expect(result.current.error).toBe(null)
})

test(`Hook returns error state when multiple \`FontFace\`s were passed and rejected`, async () => {
  const testError = new Error(`Font loading failed`)
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.reject(testError))

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

  await waitForNextUpdate()

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(false)
  expect(result.current.error).toEqual(testError)
})

test(`Hook returns error state with timeout error`, async () => {
  const timeoutError = new Error(`Timeout exceeded`)
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.reject(timeoutError))

  const { result, waitForNextUpdate } = renderHook(
    ({ fontFaces }) => useFontFaceObserver(fontFaces, { timeout: 100 }),
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

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(false)
  expect(result.current.error).toEqual(timeoutError)
})

test(`Hook starts with loading state`, () => {
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => new Promise(() => {})) // Never resolves

  const { result } = renderHook(
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

  expect(result.current.isLoading).toBe(true)
  expect(result.current.isResolved).toBe(false)
  expect(result.current.error).toBe(null)
})

test(`Hook converts non-Error rejections to Error objects`, async () => {
  MockedFontFaceObserverModule.load = jest
    .fn()
    .mockImplementationOnce(async () => Promise.reject(`String error`))

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

  expect(result.current.isLoading).toBe(false)
  expect(result.current.isResolved).toBe(false)
  expect(result.current.error).toBeInstanceOf(Error)
  expect(result.current.error?.message).toBe(`String error`)
})
