import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
  Flex,
  Text,
  TableContainer,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { formatDate } from 'utils/helper';

const SimpleTable = ({ columns, data, pageSize }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
    },
    useSortBy,
    usePagination
  );

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <>
      <TableContainer>
        <Table
          {...getTableProps()}
          variant="simple"
          color="gray.500"
          mb="24px"
          overflowX={{ base: 'auto', lg: 'hidden' }}
        >
          {/* Table header */}
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {/* Render the column header and add sorting indicators */}
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ChevronDownIcon aria-label="sorted descending" />
                          ) : (
                            <ChevronUpIcon aria-label="sorted ascending" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          {/* Table body */}
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                      >
                        <Flex align="center">
                          {/* Render the cell value */}
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.column.id === 'date'
                              ? formatDate(cell.value)
                              : cell.value}
                          </Text>
                        </Flex>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Flex justify="space-between" mt="20px">
        <IconButton
          aria-label="Previous Page"
          icon={<ChevronLeftIcon />}
          onClick={() => previousPage()}
          isDisabled={!canPreviousPage}
        />
        <IconButton
          aria-label="Next Page"
          icon={<ChevronRightIcon />}
          onClick={() => nextPage()}
          isDisabled={!canNextPage}
        />
      </Flex>
    </>
  );
};

export default SimpleTable;
