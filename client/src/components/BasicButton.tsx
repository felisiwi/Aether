import { useCallback, type ComponentProps } from 'react'
import OriginalBasicButton from '@ds/Components/basicbutton/BasicButton.1.2.0'

type Props = ComponentProps<typeof OriginalBasicButton>

/**
 * Wrapper around the DS BasicButton that guards against a bug in
 * BasicButton.1.1.0 where `e.currentTarget.matches(':focus-visible')`
 * is called inside a `requestAnimationFrame` — by which time React has
 * already set `currentTarget` to null.
 *
 * We pin `currentTarget` to the actual DOM element before the rAF is
 * scheduled so the deferred read succeeds.
 */
export default function BasicButton(props: Props) {
  const { onFocus, ...rest } = props

  const safeFocus = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      const el = e.currentTarget
      Object.defineProperty(e, 'currentTarget', {
        get() {
          return el
        },
        set() {
          /* absorb React's post-dispatch null assignment */
        },
        configurable: true,
      })
      onFocus?.(e)
    },
    [onFocus],
  )

  return <OriginalBasicButton {...rest} onFocus={safeFocus} />
}
