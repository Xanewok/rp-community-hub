import { ComponentWithAs, Input, InputProps } from '@chakra-ui/react'
import { ChangeEventHandler, useCallback, useState } from 'react'
import web3 from 'web3'

type OnAddressChange = (oldValue: string, newValue: string) => void

function validateAddress(address: string): boolean {
  return address === '' || web3.utils.isAddress(address)
}

export const AddressInput: ComponentWithAs<
  'input',
  InputProps & { onAddressChange?: OnAddressChange }
> = ({ onAddressChange, ...props }) => {
  const [isInvalid, setIsInvalid] = useState<boolean | undefined>()

  // const setAddress = useCallback(
  //   (value: string) =>
  //     setValue((old) => {
  //       if (onAddressChange) {
  //         onAddressChange(old, value)
  //       }
  //       return value
  //     }),
  //   [onAddressChange]
  // )

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      const newValue = ev.target.value

      setIsInvalid(validateAddress(newValue))
      if (web3.utils.isAddress(newValue)) {
        setIsInvalid(false)
      } else {
        setIsInvalid(newValue !== '' && true)
      }

      props.onChange && props.onChange(ev)
    },
    [props]
  )

  const accepted =
    (typeof props.value === 'undefined' || !!props.value) && !isInvalid

  return (
    <Input
      placeholder="Address"
      background={accepted ? 'purple.300' : 'purple.200'}
      _hover={{ filter: !props.disabled ? 'brightness(1.25)' : '' }}
      variant={accepted ? 'filled' : 'outline'}
      {...{ value: props.value, isInvalid }}
      {...props}
      onChange={onChange}
    />
  )
}
