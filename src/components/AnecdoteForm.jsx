import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../notificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const getId = () => (100000 * Math.random()).toFixed(0)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      console.log(newAnecdote)
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({type: 'NEW', payload: "Added a new Anecdote!"})
      setTimeout(() => {
        dispatch({type: 'HIDE', payload: null})
      }, 5000)
    },
    onError: () => {
      dispatch({type: 'NEW', payload: 'Length must be 5 or more characters'})
      setTimeout(() => {
        dispatch({type: 'HIDE', payload: null})
      }, 5000)
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length >= 5) {
      newAnecdoteMutation.mutate({content, id: getId(), votes: 0})
    } else {
      newAnecdoteMutation.mutate()
    }
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
