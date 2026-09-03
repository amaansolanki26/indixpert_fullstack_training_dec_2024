import { RouterProvider } from 'react-router-dom'
import { router } from './route/Router'
import { Provider } from 'react-redux'
import { store } from './store/Store'

const App = () => {
  return (
    <Provider store={store}>  
        <RouterProvider router={router}/>
    </Provider>
  )
}

export default App