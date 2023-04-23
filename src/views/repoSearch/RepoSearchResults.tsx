import React from 'react'
import { Box, List, ListItem, Text } from '@chakra-ui/react'
import { Repo } from '../../types'
import { StarsCount } from '../sharedComponents'
interface SearchRepoResultsProps {
  results: Repo[]
  onSelect: (repo: Repo) => void
}

const SearchRepoResults = (props: SearchRepoResultsProps): JSX.Element => {
  const { results, onSelect } = props
  return (
    <Box
      mt={1}
      style={{
        height: 'calc(100vh - 150px)',
        overflow: 'auto',
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
      }}
    >
      <List spacing={3} py={3} px={3} bg="white">
        {results.map((repo: Repo) => {
          return (
            <ListItem
              key={repo.id}
              bg="gray.100"
              p={3}
              style={{
                cursor: 'pointer',
                borderRadius: '5px',
              }}
              onClick={() => onSelect(repo)}
            >
              <Text fontSize="sm" color="blackAlpha.900">
                {repo.name}
              </Text>
              <Text fontSize="xs" color="blackAlpha.700">
                {repo.description}
              </Text>

              <Box>
                <Box display="flex" mt="2" alignItems="center" justifyContent="space-between">
                  <Text fontSize="xs" color="blue.500">
                    {repo.language}
                  </Text>
                  <StarsCount stars={repo.stargazersCount} />
                </Box>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default SearchRepoResults
