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
  console.log({
    accepted,
    value: props.value,
    disabled: props.disabled,
    isInvalid,
  })

  return (
    <Input
      placeholder="Address"
      background={accepted ? 'indigo.600' : 'indigo.700'}
      border="1px solid"
      textColor={!!props.value && !isInvalid ? undefined : 'gray.600'}
      borderColor={!isInvalid ? 'indigo.600' : '#aa4444'}
      boxShadow={
        '0 -2px 0 0 #231b4c,0 2px 0 0 #231b47,-2px 0 0 0 #231b4c,2px 0 0 0 #231b4c,0 0 0 2px #080611,0 -4px 0 0 #080611,0 4px 0 0 #080611,-4px 0 0 0 #080611,4px 0 0 0 #080611'
      }
      _hover={{ filter: props.disabled != null ? 'brightness(1.15)' : '' }}
      _focus={{
        outline: 'none',
        background: 'indigo.700',
        borderColor: !isInvalid ? 'indigo.100' : '#aa4444',
      }}
      variant={accepted ? 'filled' : 'outline'}
      borderRadius={0}
      fontSize="2xl"
      {...{ value: props.value, isInvalid }}
      {...props}
      onChange={onChange}
    />
  )
}
