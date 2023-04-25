import React, { useState, useEffect, useContext } from 'react'
import { Container, Input, Box, Spinner, Text } from '@chakra-ui/react'
import { SearchIcon, CloseIcon, WarningTwoIcon } from '@chakra-ui/icons'
import SearchRepoResults from './RepoSearchResults'
import { RepoContext } from '../../store/ReposStore'
import API from '../../api'
import useDebounce from '../../hooks/useDebounce'
import { Repo, RepoPayload } from '../../types'
import { AlertBar } from '../sharedComponents'

const SearchRepo = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [reposListResults, setReposListResults] = useState<Repo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false)
  const [showNoResultsMessage, setShowNoResultsMessage] = useState<boolean>(false)
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false)
  const [alertInfo, setAlertInfo] = useState({ message: '', description: '' })
  const { state, actions } = useContext(RepoContext)
  const { reposList } = state
  const debouncedSearchValue = useDebounce(searchValue, 400)

  /**
   * Helps on preventing interaction with the server when it isn't running.
   */
  const getIsReposerverRunning = async () => {
    const response = await API.healthCheck()
    if (response && response?.status === 200) {
      setIsServerRunning(true)
      return true
    } else {
      setIsServerRunning(false)
      return false
    }
    return
  }

  /*
   * Makes a health check on loading before allowing users to start searching for repos
   */
  useEffect(() => {
    getIsReposerverRunning()
  }, [])

  /*
   * filters results to suggest a more accurate list of user input
   */
  const filterAndFormatResults = (results: RepoPayload[]): Repo[] => {
    const searchInput = searchValue.trim()
    let regex: RegExp
    try {
      regex = new RegExp(`^${searchInput}`, 'i') //Prevents odd imputs ie. (#$&*#{{F/
    } catch (e) {
      console.error('Invalid search input')
    }
    return results
      .filter((item: RepoPayload) =>
        regex
          ? regex.test(item.name) || regex.test(item.description) || regex.test(item.full_name)
          : item
      )
      .map((item: RepoPayload) => {
        const { id, name, full_name, description, url, created_at, stargazers_count, language } =
          item || {}
        return {
          id: id.toString(),
          name,
          fullName: full_name,
          description,
          url,
          createdAt: created_at,
          stargazersCount: stargazers_count,
          language,
        }
      })
      .sort((a: Repo, b: Repo) => {
        const aValue = a.name as string
        const bValue = b.name as string
        return aValue.localeCompare(bValue)
      })
  }

  const searchRepos = async () => {
    setIsLoading(true)
    const results = await API.searchAll(searchValue.trim())

    if (results?.length) {
      const filteredResults = filterAndFormatResults(results)
      setReposListResults(filteredResults)
      setShowNoResultsMessage(filteredResults?.length === 0)
    } else {
      setShowNoResultsMessage(true)
    }
    setIsLoading(false)
  }

  // Search for repos based on user's search value after debounce timer
  useEffect(() => {
    if (searchValue.trim()?.length > 0) searchRepos() //Makes sure no to search an empty value
  }, [debouncedSearchValue])

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const handleAdd = async (repo: Repo) => {
    //Storage limit validation
    if (reposList?.length >= 10) {
      setIsAlertVisible(true)
      setAlertInfo({
        message: 'Storage limit reached!',
        description:
          'Remove elements from the table to keep adding, you are allowed to add up to 10 items.',
      })
      //Duplicates validation
    } else if (reposList?.length && reposList.find((item: Repo) => item.id === repo.id)) {
      setIsAlertVisible(true)
      setAlertInfo({
        message: 'Duplicated Repository!',
        description: 'This repository already exist, try adding a diffetent one.',
      })
      // Saves selection to DB
    } else if (getIsReposerverRunning()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, description, ...restOfRepo } = repo
      const response = await actions.addRepo(restOfRepo)
      if (response?.id)
        setReposListResults(reposListResults.filter((item: Repo) => item.id !== repo.id)) //Removes selected repo from dropdown list
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setReposListResults([])
    setShowNoResultsMessage(false)
  }

  return isServerRunning ? (
    <>
      <AlertBar
        isOpen={isAlertVisible}
        message={alertInfo.message}
        description={alertInfo.description}
        status="error"
        onClose={() => setIsAlertVisible(false)}
      />
      <Container p={8}>
        <Box display="flex" alignItems="center">
          <SearchIcon w={5} h={5} color="gray.300" />
          <Input
            value={searchValue}
            onChange={handleSearch}
            px={6}
            mx={-5}
            variant="flushed"
            placeholder="Search your favorite repo here..."
          />
          {searchValue && (
            <CloseIcon
              onClick={handleClearSearch}
              color="gray.300"
              style={{
                cursor: 'pointer',
                position: 'relative',
              }}
            />
          )}
        </Box>
        {isLoading && (
          <Box display="flex" justifyContent="center" my={20}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        )}
        {showNoResultsMessage && (
          <Box display="flex" justifyContent="center" my={20}>
            <Text fontSize="sm">No results where found for: '{searchValue}'</Text>
          </Box>
        )}
        {reposListResults?.length > 0 && !isLoading && (
          <SearchRepoResults results={reposListResults} onSelect={handleAdd} />
        )}
      </Container>
    </>
  ) : (
    <Box display="flex" justifyContent="center" textAlign="center" p={8} my={20}>
      <Text fontSize="sm" color="orange.500">
        <WarningTwoIcon color="orange.500" mr={1} w={5} h={5} />
        {`Make sure to start REPOSERVER first.`} <br />
        {`Once started, roload the page to use the app!`}
      </Text>
    </Box>
  )
}

export default SearchRepo
