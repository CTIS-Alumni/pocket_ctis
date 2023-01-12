import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import InstantSearch from "../../../components/InstantSearch/InstantSearch";
import {useEffect, useState} from "react";

const CompaniesDashboard = ({ companies }) => {
    //FROM HERE//
    const [searchValue, setSearchValue] = useState("");
    const [locale, setLocale] = useState("tr");

    function search(e){
            let val = e.target.value;
            if(locale == "en-US")
                val = val.replace(/ğ/gim, "g")
                    .replace(/ü/gim, "u")
                    .replace(/ş/gim, "s")
                    .replace(/ı/gim, "i")
                    .replace(/ö/gim, "o")
                    .replace(/ç/gim, "c");
            setSearchValue(val);
    }
    let filtered;
    if(locale === "en-US"){
         filtered = searchValue === "" ? companies :  companies.filter(company => (company.company_name.replace(/\s/g, '')
            .replace(/ğ/gim, "g")
            .replace(/ü/gim, "u")
            .replace(/ş/gim, "s")
            .replace(/ı/gm, "i")
            .replace(/İ/gm, "i")
            .replace(/ö/gim, "o")
            .replace(/ç/gim, "c")
            .toLocaleUpperCase(locale).includes(searchValue.replace(/\s/g, '').toLocaleUpperCase(locale))));
    }else{
        filtered = searchValue === "" ? companies :  companies.filter(company => (company.company_name.replace(/\s/g, '')
            .toLocaleUpperCase(locale).includes(searchValue.toLocaleUpperCase(locale).replace(/\s/g, ''))));
    }


    function changeLocale(e){
        setLocale(e.target.value);
    }
    //TO HERE, THESE SHOULD WORK AS COMPONENT IN components/InstantSearch
  return (
    <main>
        <NavigationBar />
        <UserInfoSidebar />
        <div>
            <input onChange={search}/>
            <button onClick={changeLocale} value="en-US">En</button>
            <button onClick={changeLocale} value="tr">Tr</button>
            <CompaniesList companies={filtered} />
        </div>

    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/companies",{
      headers:{
          'x-api-key':process.env.API_KEY
      }
  });
  const data = await res.json()
  return { props: { companies: data.companies } }
}

export default CompaniesDashboard
