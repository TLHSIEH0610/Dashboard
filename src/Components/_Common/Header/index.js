import React, { Fragment } from 'react';
import styles from './header.module.scss'
// import Context from '../../../Utility/Reduxx'

const Header = () => {
  // const { state, dispatch } = useContext(Context)
  return (
    <Fragment>
        <div className={styles.head}>
            {/* <p>{state.ABC}</p> */}
        </div>
    </Fragment>
  )

}

export default Header