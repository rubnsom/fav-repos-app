import React, { useReducer } from 'react'
import * as types from '../actions/repoTypes'
import { useRepoActions } from '../actions'
import { Repo, State, Dispatch } from '../types'

interface ProviderProps {
  children: JSX.Element
}

const initialState = {
  reposList: [],
} as State

const contextIntialState = {
  actions: {
    addRepo: (params: Repo): Promise<Repo> => {
      return
    },
    getReposList: (): Promise<Repo> => {
      return
    },
  },
  state: initialState,
}

const RepoContext = React.createContext(contextIntialState)
const { Provider } = RepoContext

const reducer = (state: State, action: Dispatch) => {
  switch (action.type) {
    case types.ADD_REPO_SUCCESS: {
      const { reposList } = state
      return {
        ...state,
        reposList: [...reposList, action.value],
      }
    }
    case types.GET_REPO_LIST_SUCCESS: {
      return {
        ...state,
        reposList: action.value,
      }
    }
    case types.ADD_REPO_FAILURE:
    case types.GET_REPO_LIST_FAILURE:
      return {
        ...state,
        error: action.error,
      }
    default:
      return { ...state }
  }
}

const RepoProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useRepoActions(dispatch)

  return <Provider value={{ state, actions }}>{children}</Provider>
}

export { RepoProvider, RepoContext }