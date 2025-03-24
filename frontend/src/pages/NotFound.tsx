import { FC } from 'react'
import { Link } from 'react-router-dom'

const NotFound: FC= () => {
  return (
    <div className='error-page'>
      <h2>Ошибка 404</h2>
      <p>страница не найдена</p>
      <Link to="/">на главную</Link>
    </div>
  )
}

export default NotFound
