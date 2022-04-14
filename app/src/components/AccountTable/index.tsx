import {
  Text,
  Box,
  Button,
  Img,
  Flex,
  Tooltip,
  useToast,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  IconButton,
  createIcon,
  Input,
  NumberInput,
  NumberInputField,
  Checkbox,
} from "@chakra-ui/react";

export const AccountList = (props) => {
  return (
    <Table mb="0.6em">
      <Thead>
        <Tr>
          <Th w="32rem">Address</Th>
          <Tooltip label="Whether a given address has approved this contract to transfer $CFTI">
            <Th>Approved</Th>
          </Tooltip>
          <Tooltip label="Whether a given address has authorized the selected Controller account to move $CFTI on their behalf">
            <Th>Authorized</Th>
          </Tooltip>
          <Th>Pending</Th>
          <Th>
            <IconButton
              disabled={!connected}
              size="sm"
              aria-label="Create"
              icon={<PlusIcon />}
              onClick={() => setAccountList((old) => [...old, ""])}
            />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {Array.from(accountList.values())
          .map((element) => {
            console.log("inspect - " + element);
            return element;
          })
          .map((acc, idx) => (
            <Tr key={acc}>
              <Td w="32rem">
                <AddressInput
                  // onAddressChange={(old, _new) => {
                  onChange={(ev) => {
                    const newValue = ev.target.value;
                    console.log({ newValue });
                    // console.log({ old, _new })
                    setAccountList((list) => {
                      list[idx] = newValue;
                      return list;
                    });
                    // setAccountList((list) => {
                    //   list.delete(old)
                    //   if (!!_new) {
                    //     list.add(_new)
                    //   }
                    //   return list
                    // })
                    // console.log("old: " + el.currentTarget.value);
                    // console.log("new: " + el.target.value);
                  }}
                  // value={acc}
                />
              </Td>
              <Td>
                <ApproveCfti owner={acc} />
              </Td>
              <Td>TODO</Td>
              <Td>
                <Flex justifyContent={"space-around"}>
                  <Text>fds</Text>
                  <Img src="/cfti.png" />
                </Flex>
              </Td>
              <Td>
                <IconButton
                  disabled={!connected}
                  size="sm"
                  aria-label="Delete"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    setAccountList((list) => list.filter((el, i) => i != idx));
                  }}
                />
              </Td>
            </Tr>
          ))}
        <Tr></Tr>
      </Tbody>
    </Table>
  );
};
