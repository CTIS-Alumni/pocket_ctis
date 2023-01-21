import styles from '../PageNavigation/PageNavigation.module.scss'
import {useRef} from "react";
const PageNavigation = ({pageDisplay, page, changePage, totalPage}) => {

    const pageTemp = (Math.ceil(page/pageDisplay) - parseInt(1)) * parseInt(pageDisplay);
    let pageArr = new Array(pageDisplay-1).fill("");
    const jump = useRef("");

    const onSubmit = (e) => {
        e.preventDefault();
        if(jump.current.value != page && jump.current.value != "" && jump.current.value >= 1 && jump.current.value <= totalPage){
            changePage({target:{value:jump.current.value}});
            jump.current.value = "";
        }
    }

    return(
        <div className={styles.left}>
            {page > pageDisplay && (<button value={1} onClick={changePage}>{`<<`}</button>)}
            {page != 1 && (<button value={parseInt(page)-parseInt(1)} onClick={changePage}>{`<`}</button>)}
            <button className={page == parseInt(pageTemp)  + parseInt( 1) ? styles.selected : styles.unselected} value={pageTemp  + parseInt(1)} onClick={changePage}>{parseInt(pageTemp)  + parseInt(1)}</button>
            {pageArr.map((e,index)=>(
                parseInt(totalPage) - (pageTemp  + parseInt(1)) > index &&  (<button key={index} className={page == parseInt(pageTemp)  + parseInt(index + 2) ? styles.selected : styles.unselected} value={parseInt(pageTemp)  + parseInt(index + 2)} onClick={changePage}>{parseInt(pageTemp)  + parseInt(index + 2)}</button>)
                ))}
            {totalPage != page && (<button value={parseInt(page)+parseInt(1)} onClick={changePage}>{`>`}</button>)}
            {parseInt(totalPage) - (pageTemp  + parseInt(1)) > pageDisplay - 1 && (<button value={totalPage} onClick={changePage}>{`>>`}</button>)}

            <form onSubmit={onSubmit}>
                <input type="text" ref={jump}/>
                <button>Jump</button>
                {totalPage > 0 && (<span>{totalPage} Pages</span>)}
            </form>
        </div>
    );
}

export default PageNavigation