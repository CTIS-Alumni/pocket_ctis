import {useContext, useState, useEffect} from 'react'
import {FieldArray, Field, Formik, Form} from 'formik'
import {cloneDeep} from 'lodash'
import styles from './PersonalInformationForm.module.css'
import {
    EyeFill,
    EyeSlashFill,
    XCircleFill,
} from 'react-bootstrap-icons'

import {Location_data} from '../../../../context/locationContext'
import {omitFields, replaceWithNull, splitFields, submit} from "../../../../helpers/submissionHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";
import {fetchAllHighSchool, fetchAllSectors} from '../../../../helpers/searchHelpers'

const PersonalInformationForm = ({data}) => {
    const {locationData} = useContext(Location_data)
    // const [sectors, setSectors] = useState([]);
    const [highSchools, setHighSchools] = useState([]);
    const [dataAfterSubmit, setDataAfterSubmit] = useState(data);


    useEffect(() => {
        /*fetchAllSectors().then((res) => {
            setSectors(
                res.data.map((s) => {
                    return {
                        ...s,
                        sector: `${s.id}-${s.sector_name}`,
                    }
                })
            )
        })*/
        fetchAllHighSchool().then((res) => setHighSchools(res.data))
    }, [])


    const applyNewData = (data) => {
        setDataAfterSubmit(data);
    }

    let deletedData = {
        location: [],
        career_objective: [],
        high_school: []
    };

    const transformData = (data) => {
        let newData = cloneDeep(data);
        newData = newData.map((datum) => {
            datum.visibility = datum.visibility == 1;
            return datum
        })
        return newData
    }

    const transformLocation = (location) => {
        const newData = cloneDeep(location);
        if (location.length > 0) {
            newData[0].country = `${location[0].country_id}-${location[0].country_name}`;
            newData[0].city = `${location[0].city_id}-${location[0].city_name}`;
            newData[0].visibility = location[0].visibility == 1;
        }
        return newData;
    }

    /* const transformWantedSectors = (data) => {
         const newData = {};
         newData.sectors = data.map(
             (sector) => `${sector.sector_id}-${sector.sector_name}`
         )
         if (newData.sectors.length > 0)
             newData.visibility = data[0].visibility == 1
         return newData
     }*/

    const transformHighSchool = (data) => {
        let newData = cloneDeep(data);
        newData = newData.map((datum) => {
            datum.visibility = datum.visibility == 1
            datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`
            return datum
        })
        return newData
    }


    const transformFuncs = {
        career_objective: (newData) => {
            if (newData.career_objective.length > 0) {
                if (newData.career_objective[0].career_objective.trim() == ""){
                    newData.career_objective = [];
                }
                else newData.career_objective[0].visibility = newData.career_objective[0].visibility ? 1 : 0;
            }
        },
        high_school: (newData) => {
            if (newData.high_school.length > 0) {
                if (newData.high_school[0].high_school == "")
                    newData.high_school = [];
                else {
                    newData.high_school[0].visibility = newData.high_school[0].visibility ? 1 : 0;
                    splitFields(newData.high_school[0], ["high_school"])
                }
            }
        },
        location: (newData) => {
            if (newData.location.length > 0) {
                if (newData.location[0].country == "")
                    newData.location = [];
                else{
                    newData.location[0].visibility = newData.location[0].visibility ? 1 : 0;
                    replaceWithNull(newData.location[0]);
                    splitFields(newData.location[0], ["country", "city"]);
                }
            }
        }
    }


    /* wanted_sectors: (newData) => {
           let sectors = [];
           let flag = false;
           if (newData.wanted_sectors.sectors && newData.wanted_sectors.sectors.length > 0) {
               const sector_visibility = newData.wanted_sectors.visibility ? 1 : 0;
               newData.wanted_sectors.sectors.forEach((sector) => {
                   if (sector) {
                       const split = sector.split("-");
                       sectors.push({sector_id: parseInt(split[0]), sector_name: split[1], visibility: sector_visibility});
                   } else flag = true;
               });
           }
           if (flag)
               sectors = [];
           newData.wanted_sectors = sectors;
       },*/

    const onSubmit = async (values) => {
        let newData = await cloneDeep(values)

        transformFuncs.location(newData);
        if (dataAfterSubmit.location.length > newData.location.length && dataAfterSubmit.location[0].id != "") {
            deletedData.location.push({
                name: dataAfterSubmit.location[0].id,
                id: dataAfterSubmit.location[0].id,
                data: dataAfterSubmit.location[0]
            });
            values.location = [];
        }

        transformFuncs.high_school(newData);
        if(dataAfterSubmit.high_school.length > newData.high_school.length && dataAfterSubmit.high_school[0].id){
            deletedData.high_school.push({
                name: dataAfterSubmit.high_school[0].id,
                id: dataAfterSubmit.high_school[0].id,
                data: dataAfterSubmit.high_school[0]
            });
            values.high_school = [];
        }

        transformFuncs.career_objective(newData);
        if (dataAfterSubmit.career_objective.length > newData.career_objective.length && dataAfterSubmit.career_objective[0].id) {
            deletedData.career_objective.push({
                name: dataAfterSubmit.career_objective[0].id,
                id: dataAfterSubmit.career_objective[0].id,
                data: dataAfterSubmit.career_objective[0]
            });
            values.career_objective = [];
        }


        /*transformFuncs.wanted_sectors(newData); //special case
        let flag = false;
        let is_found;
        if(dataAfterSubmit.wanted_sectors.length > 0){
            dataAfterSubmit.wanted_sectors.forEach((sector) => {
                is_found = newData.wanted_sectors.find((s, i) => {
                    if (s.sector_name == sector.sector_name) {
                        newData.wanted_sectors[i].id = sector.id;
                        return true;
                    } else flag = true;
                });
                if (is_found == undefined)
                    deletedData.wanted_sectors.push({name: sector.id, id: sector.id, data: sector});
            });
            if (flag)
                newData.wanted_sectors = [];
        }*/

        let requestObj = {
            location: {},
            career_objective: {},
            high_school: {}
        };
        let responseObj = {
            location: {},
            career_objective: {},
            high_school: {}
        };

        const args = {
            location: [["country", "city"], [], ["id", "user_id"], []],
            career_objective: [[], [], ["id", "user_id"], []],
            high_school: [["high_school"], [], ["user_id", "id"], []]
        };
        console.log("heres values", values);
        console.log("heres deleted data", deletedData);
        const final_data = {location: [], career_objective: [], high_school: []};
        await Promise.all(Object.keys(omitFields(dataAfterSubmit, ["basic_info", "wanted_sectors"])).map(async (key) => {
            const send_to_req = {};
            send_to_req[key] = cloneDeep(dataAfterSubmit[key]);
            transformFuncs[key](send_to_req);
            requestObj[key] = createReqObject(send_to_req[key], newData[key], deletedData[key]);
            const url = craftUserUrl(1, key);
            responseObj[key] = await submitChanges(url, requestObj[key]);
            console.log("response", responseObj)

            final_data[key] = submit(requestObj[key], responseObj[key], values, key, args[key], transformFuncs[key]);
        }));

        applyNewData(final_data);
        console.log("req", requestObj, "res", responseObj);

        deletedData = {
            location: [],
            career_objective: [],
            high_school: []
        };
    }

    const {
        basic_info,
        career_objective,
        location,
        //wanted_sectors,
        high_school
    } = data

    return (
        <Formik
            initialValues={{
                first_name: basic_info[0].first_name,
                last_name: basic_info[0].last_name,
                career_objective: transformData(career_objective),
                location: transformLocation(location),
                //wanted_sectors: transformWantedSectors(wanted_sectors),
                high_school: transformHighSchool(high_school)
            }}
            enableReinitialize
            onSubmit={onSubmit}
        >
            {(props) => {
                return (
                    <>
                        <Form>
                            <table style={{width: '100%'}}>
                                <tbody>
                                <tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                First Name
                                            </label>
                                            <Field
                                                className={`${styles.inputField}`}
                                                style={{width: '100%'}}
                                                disabled
                                                id='first_name'
                                                name='first_name'
                                                placeholder='First Name'
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                last Name
                                            </label>
                                            <Field
                                                className={`${styles.inputField}`}
                                                disabled
                                                id='last_name'
                                                name='last_name'
                                                placeholder='Last Name'
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                Career Objectives
                                            </label>{props.values.career_objective[0]?.id}
                                            <Field
                                                className={`${styles.inputField}`}
                                                as='textarea'
                                                rows={5}
                                                id='career_objective[0].career_objective'
                                                name='career_objective[0].career_objective'
                                                placeholder='Enter your career objectives...'
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.visibilityCheckboxContainer}>
                                        <Field name='career_objective[0].visibility'>
                                            {({field, form, meta}) => {
                                                return (
                                                    <label>
                                                        {field.value ? (
                                                            <EyeFill
                                                                size={20}
                                                                className={`${styles.visibilityUnchecked} ${styles.visibilityCheckbox}`}
                                                            />
                                                        ) : (
                                                            <EyeSlashFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox}`}
                                                            />
                                                        )}
                                                        <input
                                                            type='checkbox'
                                                            {...field}
                                                            style={{display: 'none'}}
                                                        />
                                                    </label>
                                                )
                                            }}
                                        </Field>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{display: 'flex'}}>
                                            <div className={styles.removeBtnContainer}>
                                                <button
                                                    className={styles.removeBtn}
                                                    type='button'
                                                    onClick={() => {
                                                        if (props.values.high_school[0])
                                                            props.setFieldValue(`high_school[0].high_school`, '');
                                                    }}
                                                >
                                                    <XCircleFill
                                                        size={13}
                                                        className={styles.removeIcon}
                                                    />{props.values.high_school[0]?.id}
                                                </button>
                                            </div>
                                            <div style={{flexGrow: '1'}}>
                                                <div className={styles.inputContainer}>
                                                    <label className={styles.inputLabel}>
                                                        High School
                                                    </label>
                                                    <Field
                                                        as='select'
                                                        name='high_school[0].high_school'
                                                        id='high_school[0].high_school'
                                                        className={styles.inputField}
                                                    >
                                                        <option selected value='' disabled>
                                                            Please select High School
                                                        </option>
                                                        {highSchools.map((highSchool, index) => (
                                                            <option
                                                                key={index}
                                                                value={`${highSchool.id}-${highSchool.high_school_name}`}
                                                            >
                                                                {highSchool.high_school_name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.visibilityCheckboxContainer}>
                                        <Field name={`high_school[0].visibility`}>
                                            {({field, form, meta}) => {
                                                return (
                                                    <label>
                                                        {field.value ? (
                                                            <EyeFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                                            />
                                                        ) : (
                                                            <EyeSlashFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox}`}
                                                            />
                                                        )}
                                                        <input
                                                            type='checkbox'
                                                            {...field}
                                                            style={{display: 'none'}}
                                                        />
                                                    </label>
                                                )
                                            }}
                                        </Field>
                                    </td>
                                </tr>
                                {/*<tr>
                                    <td>
                                        <div className={`${styles.inputContainer}`}>
                                            <label className={`${styles.inputLabel}`}>
                                                Sectors I want to work in
                                            </label>
                                            <Field
                                                className={`${styles.inputField}`}
                                                as='select'
                                                rows={5}
                                                id='wanted_sectors.sectors'
                                                name='wanted_sectors.sectors'
                                                multiple={true}
                                            >
                                                <option value='' selected>
                                                    None
                                                </option>
                                                {sectors.map((s) => (
                                                    <option value={s.sector}>{s.sector_name}</option>
                                                ))}
                                            </Field>
                                        </div>
                                    </td>
                                    <td className={styles.visibilityCheckboxContainer}>
                                        <Field name='wanted_sectors.visibility'>
                                            {({field, form, meta}) => {
                                                return (
                                                    <label>
                                                        {field.value ? (
                                                            <EyeFill
                                                                size={20}
                                                                className={`${styles.visibilityUnchecked} ${styles.visibilityCheckbox}`}
                                                            />
                                                        ) : (
                                                            <EyeSlashFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox}`}
                                                            />
                                                        )}
                                                        <input
                                                            type='checkbox'
                                                            {...field}
                                                            style={{display: 'none'}}
                                                        />
                                                    </label>
                                                )
                                            }}
                                        </Field>
                                    </td>
                                </tr>*/}
                                <tr>
                                    <td colSpan={3}>
                                        <div className={styles.formPartitionHeading}>
                                            <span>Location</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{display: "flex"}}>
                                            <div className={styles.removeBtnContainer}>
                                                <button
                                                    className={styles.removeBtn}
                                                    type='button'
                                                    onClick={() => {
                                                        if (props.values.location[0]){
                                                            props.setFieldValue(`location[0].country`, '');
                                                            props.setFieldValue(`location[0].city`, '');
                                                        }
                                                    }}
                                                >
                                                    <XCircleFill
                                                        size={13}
                                                        className={styles.removeIcon}
                                                    />{props.values.location[0]?.id}
                                                </button>
                                            </div>
                                            <div style={{flexGrow: '1'}}>
                                                <div className={`${styles.inputContainer}`}>
                                                    <label className={`${styles.inputLabel}`}>
                                                        Country
                                                    </label>
                                                    <Field
                                                        as='select'
                                                        className={`${styles.inputField}`}
                                                        id='location[0].country'
                                                        name='location[0].country'
                                                        onChange={(event) => {

                                                            props.setFieldValue('location[0]city', '')
                                                            props.setFieldValue(
                                                                'location[0]country',
                                                                event.target.value
                                                            )
                                                        }}
                                                    >
                                                        <option selected disabled value=''>
                                                            Please select a Country
                                                        </option>
                                                        {Object.keys(locationData).map((country) => {
                                                            let countryName = country.split('-')[1]
                                                            return (
                                                                <option value={country}>{countryName}</option>
                                                            )
                                                        })}
                                                    </Field>
                                                </div>
                                                <div className={`${styles.inputContainer}`}>
                                                    <label className={`${styles.inputLabel}`}>City</label>
                                                    <Field
                                                        as='select'
                                                        className={`${styles.inputField}`}
                                                        id='location[0].city'
                                                        name='location[0].city'
                                                        disabled={!props.values.location[0]?.country}
                                                        onChange={(event) => {
                                                            props.setFieldValue(
                                                                'location[0]city',
                                                                event.target.value
                                                            )
                                                        }}
                                                    >
                                                        <option selected value={''}>
                                                            Please select a{' '}
                                                            {props.values.location[0]?.country
                                                                ? 'City'
                                                                : 'Country'}
                                                        </option>
                                                        {locationData[props.values.location[0]?.country]?.map(
                                                            (city) => {
                                                                let cityName = city.split('-')[1]
                                                                return <option value={city}>{cityName}</option>
                                                            }
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.visibilityCheckboxContainer}>
                                        <Field name='location[0].visibility'>
                                            {({field, form, meta}) => {
                                                return (
                                                    <label>
                                                        {field.value ? (
                                                            <EyeFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                                            />
                                                        ) : (
                                                            <EyeSlashFill
                                                                size={20}
                                                                className={`${styles.visibilityCheckbox}`}
                                                            />
                                                        )}
                                                        <input
                                                            type='checkbox'
                                                            {...field}
                                                            style={{display: 'none'}}
                                                        />
                                                    </label>
                                                )
                                            }}
                                        </Field>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div>
                                <button type='submit' className={styles.submitBtn}>
                                    Submit
                                </button>
                            </div>
                        </Form>
                    </>
                )
            }}
        </Formik>
    )
}

export default PersonalInformationForm
