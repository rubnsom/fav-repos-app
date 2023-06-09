import React from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'
import SearchRepo from './repoSearch/RepoSearch'
import RepoLibrary from './repoLibrary/RepoLibrary'

const FavReposManager = (): JSX.Element => {
  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'400px 1fr'}
      h="100vh"
      gap="1"
      color="blackAlpha.700"
    >
      <GridItem
        p="4"
        bg="gray.700"
        color="white"
        area={'header'}
        display="flex"
        alignItems="center"
        textAlign="center"
      >
        Search and Collect your Favorite GitHub Repositories
      </GridItem>
      <GridItem bg="gray.50" area={'nav'}>
        <SearchRepo />
      </GridItem>
      <GridItem p="8" bg="white" area={'main'} overflow="auto">
        <RepoLibrary />
      </GridItem>
      <GridItem px="4" py="2" bg="gray.50" area={'footer'}>
        <Text fontSize="2xs" color="blackAlpha.500">
          JPMorgan Chase - The Infatuation | Take Home Challenge by Ruben Ruvalcaba
        </Text>
      </GridItem>
    </Grid>
  )
}

export default FavReposManager
