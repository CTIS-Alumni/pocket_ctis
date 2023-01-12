import React from 'react'
import { Navbar } from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'

import styles from './NavigationBar.module.scss'
import {useRouter} from "next/router";

const NavigationBar = () => {
    const router = useRouter();
    const onSearch = ({ searchValue }) => {
        if (searchValue.length > 0) {
            router.push({
                pathname: '/user/search',
                query: { searchValue },
                as: '/user/search',
            })
        }
    }

    return (
      <>
        <Navbar className={styles.navbar}>
          <Navbar.Brand
          href='/user'
          className={styles.navbar_logo}
          >
            PocketCTIS
          </Navbar.Brand>
            <SearchBar onSubmit={onSearch} />
        </Navbar>
      </>
    )
  }

export default NavigationBar
