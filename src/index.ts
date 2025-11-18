import { useState, useEffect } from "react"
import FontFaceObserver from "fontfaceobserver"

/**
 * @typedef FontFace
 * @property {string} family The font-family: Roboto, Inter, Open Sans, etc
 * @property {string|number} weight The font-weight: normal, bold, 800, etc
 * @property {string} style The font-style: normal, italic, oblique
 * @property {string} stretch The font stretch: normal, condensed, expanded, etc
 */
export interface FontFace {
  family: string
  weight?:
    | `light`
    | `normal`
    | `bold`
    | `bolder`
    | `100`
    | `200`
    | `300`
    | `400`
    | `500`
    | `600`
    | `700`
    | `800`
    | `900`
  style?: `normal` | `italic` | `oblique`
  stretch?:
    | `normal`
    | `ultra-condensed`
    | `extra-condensed`
    | `condensed`
    | `semi-condensed`
    | `semi-expanded`
    | `expanded`
    | `extra-expanded`
    | `ultra-expanded`
}

export interface Options {
  testString?: string
  timeout?: number
}

export interface Config {
  showErrors: boolean
}

export interface UseFontFaceObserverResult {
  isLoading: boolean
  isResolved: boolean
  error: Error | null
}

function useFontFaceObserver(
  fontFaces: FontFace[] = [],
  { testString, timeout }: Options = {},
  { showErrors }: Config = { showErrors: false }
): UseFontFaceObserverResult {
  const [isLoading, setIsLoading] = useState(true)
  const [isResolved, setIsResolved] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fontFacesString = JSON.stringify(fontFaces)

  useEffect(() => {
    setIsLoading(true)
    setIsResolved(false)
    setError(null)

    const promises = JSON.parse(fontFacesString).map(
      ({ family, weight, style, stretch }: FontFace) =>
        new FontFaceObserver(family, {
          weight,
          style,
          stretch,
        }).load(testString, timeout)
    )

    Promise.all(promises)
      .then(() => {
        setIsLoading(false)
        setIsResolved(true)
      })
      .catch((e: unknown) => {
        setIsLoading(false)
        const errorObj = e instanceof Error ? e : new Error(String(e))
        setError(errorObj)
        if (showErrors) {
          // eslint-disable-next-line no-console
          console.error(`An error occurred during font loading`, e)
        }
      })
  }, [fontFacesString, testString, timeout, showErrors])

  return { isLoading, isResolved, error }
}

export default useFontFaceObserver
