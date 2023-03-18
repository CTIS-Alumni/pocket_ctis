import {cloneDeep, findIndex, isEqual, pick} from "lodash";
//this file has functions that help in preparing the data in submit forms for submission

export const splitFields = (data, fields) => {
    //splits field into name and id values
    //data usually comes in this form: university: 19-Bilkent (id-name)
    //we want to split it to university_id = 19 and university_name = Bilkent
    fields.forEach((field) => {
        if (data.hasOwnProperty(field) && data[field] != null && data[field] != "null-null") {
            const splitData = data[field].split("-");
            data[field + "_id"] = parseInt(splitData[0]);
            data[field + "_name"] = splitData[1];
        }else if(data.hasOwnProperty(field)){
            data[field + "_id"] = null;
            data[field + "_name"] = null;
        }
        delete data[field];
    });
}

export const replaceWithNull = (data) => {
    Object.keys(data).forEach((field) => {
        if (data[field] === "")
            data[field] = null;
    });
}

//deep compares 2 objects but with the option to omit optional data from either/both objects
//data comes from the req object (frontend forms), compared_data comes from the res object (db)
export const isEqualFields = (data, compared_data, name_id_pair, toOmitFromData, toOmitFromCompared, has_date) => {
    name_id_pair.forEach((field)=>{
        if(!data.hasOwnProperty(field + "_id"))
            data[field + "_id"] = null;
        delete data[field + "_name"]; // name unnecessary for comparison so delete
    });

    has_date.forEach((date_field) => { //date coming from db and going from form can be different iso value pointing to same day
        if(data.hasOwnProperty(date_field)){//so compare it with month, day and year only
            const new_date = new Date(data[date_field]).toString();
            const split = new_date.split(" ");
            data[date_field] = split[1] + " " +split[2] + " " + split[3];
        }
        if(compared_data.hasOwnProperty(date_field)){
            const new_date = new Date(compared_data[date_field]).toString();
            const split = new_date.split(" ");
            compared_data[date_field] = split[1] + " " +split[2] + " " + split[3];
        }
    })
    return isEqual(omitFields(data, toOmitFromData), omitFields(compared_data, toOmitFromCompared));
}


export const convertToIso = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}


//need this because lodash omit will be obsolete
export const omitFields = (obj, fields) => {
    let keys_list = Object.keys(obj);
    keys_list = keys_list.filter(key => !fields.includes(key));
    return pick(obj, keys_list);
}

//checks
export const handleResponse = (req, res, values, name, args, transformForSubCallback) => {
    req.DELETE.forEach((toDelete)=>{
        if(!res.DELETE.data?.hasOwnProperty(toDelete.id)){
            values[name].push(toDelete.data);
        }
    });
//values is an array of projects
    const cloned_values = cloneDeep(values);
    transformForSubCallback(cloned_values);
    if(req.POST.length > 0){
        req.POST.forEach((toInsert)=>{
            const index = findIndex(cloned_values[name], (item) => {
                return isEqual(item, toInsert);
            });
            if(index != -1){
                const found_in_res = res.POST.data?.find(datum => {
                      return isEqualFields(toInsert, datum.inserted, args[0], args[1], args[2], args[3]);
                    }
                );
                if(found_in_res != undefined){//for ones with id,
                    if(!values[name][index].hasOwnProperty("id")){
                        values[name][index].id = found_in_res.inserted.id;
                    }
                }
            }
        });
    }

    return cloneDeep(values[name]);
}

