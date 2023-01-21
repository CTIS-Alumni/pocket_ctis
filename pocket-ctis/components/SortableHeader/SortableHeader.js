import styles from "../SortableHeader/SortableHeader.module.scss";
import {CaretDown, CaretDownFill, CaretUp, CaretUpFill} from "react-bootstrap-icons";

const SortableHeader = ({sort, changeSort, field_name, column_name}) => {
    return (
        <th className={styles.sortable_column} onClick={() => changeSort(field_name)}>{column_name}
            {sort.column === field_name ? (sort.order === "desc" ? (
                        <span className={styles.header_icon}><CaretUpFill/> <CaretDown/></span>) :
                    <span className={styles.header_icon}><CaretUp/><CaretDownFill/></span>) :
                <span className={styles.header_icon}><CaretUp/> <CaretDown/></span>}</th>
    );
}

export default SortableHeader;
